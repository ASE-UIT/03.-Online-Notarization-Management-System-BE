const { ethers } = require('ethers');
const pinataSDK = require('@pinata/sdk');
require('dotenv').config();
const { Readable } = require('stream');

// Initialize Pinata client
const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_KEY);

// Initialize Alchemy provider
const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);

// Initialize wallet signer
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Smart contract configuration
const contractConfig = {
  address: process.env.CONTRACT_ADDRESS,
  abi: require('../../contractABI.json'),
};

const contract = new ethers.Contract(contractConfig.address, contractConfig.abi, signer);

// Upload file to IPFS using Pinata
const uploadToIPFS = async (fileBuffer, fileName) => {
  try {
    // Convert the buffer to a readable stream
    const stream = Readable.from(fileBuffer);

    const options = {
      pinataMetadata: {
        name: fileName,
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };

    // Pass the stream instead of the buffer
    const result = await pinata.pinFileToIPFS(stream, options);
    return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
};

// Mint NFT with document hash
const mintDocumentNFT = async (tokenURI) => {
  try {
    const nftTx = await contract.mintNFT(signer.address, tokenURI);
    const receipt = await nftTx.wait();
    console.log('Transaction Receipt:', receipt);
    return {
      transactionHash: receipt.hash,
    };
  } catch (error) {
    console.error('Error minting NFT:', error);
    throw error;
  }
};

// Get transaction and NFT data from blockchain
const getTransactionData = async (transactionHash) => {
  try {
    // Validate transaction hash
    if (!transactionHash || typeof transactionHash !== 'string') {
      throw new Error('Invalid transaction hash');
    }

    // Get transaction details
    const transaction = await provider.getTransaction(transactionHash);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    const receipt = await provider.getTransactionReceipt(transactionHash);
    const block = await provider.getBlock(transaction.blockNumber);

    // Calculate age metrics
    const currentTime = Math.floor(Date.now() / 1000);
    const ageInSeconds = currentTime - block.timestamp;
    const ageInMinutes = Math.floor(ageInSeconds / 60);
    const ageInHours = Math.floor(ageInMinutes / 60);
    const ageInDays = Math.floor(ageInHours / 24);

    // Find Transfer event and extract tokenId
    const transferEvent = receipt.logs
      .map((log) => {
        try {
          return contract.interface.parseLog({
            topics: log.topics,
            data: log.data,
          });
        } catch (e) {
          return null;
        }
      })
      .find((event) => event && event.name === 'Transfer');

    const tokenId = transferEvent ? transferEvent.args[2] : null;

    // Get Token URI if tokenId exists
    let tokenURI = null;
    if (tokenId) {
      tokenURI = await contract.tokenURI(tokenId);
    }

    return {
      transactionHash,
      tokenId: tokenId ? tokenId.toString() : null,
      tokenURI,
      blockNumber: transaction.blockNumber,
      timestamp: block.timestamp,
      age: {
        seconds: ageInSeconds,
        minutes: ageInMinutes,
        hours: ageInHours,
        days: ageInDays,
      },
    };
  } catch (error) {
    console.error('Error fetching transaction data:', error);
    throw error;
  }
};

module.exports = {
  pinata,
  provider,
  signer,
  contract,
  uploadToIPFS,
  mintDocumentNFT,
  getTransactionData,
};
