# CongChungOnline Backend

This repository contains the backend code for **CongChungOnline**, a platform for online notarization services that leverages blockchain and NFT for document storage.

## Features

- **Document Upload:** Users can upload their documents for notarization.
- **Notary Service Selection:** Users can select from various notary services tailored to their needs.
- **Requester Information:** Users provide personal details for notarization requests.
- **Email Notifications:** Users are kept informed via email about the status of their notarization requests.
- **Firebase Integration:** Securely stores documents on Firebase Cloud Storage.
- **Blockchain & NFT Storage:** Document records are stored securely using blockchain technology and NFTs.
- **Authentication:** Uses JWT-based authentication for secure access.
- **Role-Based Access Control:** Provides different levels of access based on user roles (e.g., admin, customer, notary).
- **Google OAuth:** Allows users to sign in using their Google accounts.
- **Payment Gateway Integration:** Supports online payments for notarization services.
- **Gemini API Integration:** Uses the Gemini API for generating AI-powered documents.
- **VietQR Integration:** Generates QR codes for document verification.
- **API Documentation:** Provides detailed documentation for all APIs using Swagger.
- **Docker Support:** Allows the application to be run in a Docker container.

## Technologies

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Storage:** Firebase Cloud Storage
- **Authentication:** JWT, Passport.js
- **Validation:** Joi
- **Testing:** Jest
- **Security:** Helmet, Xss-Clean, Express-Mongo-Sanitize
- **Middleware:** Winston (logging), Morgan (HTTP request logging)
- **API Documentation:** Swagger
- **Environment Configuration:** Dotenv, Cross-env
- **Process Management:** PM2
- **Continuous Integration:** Travis CI
- **Code Quality:** Coveralls, Codacy
- **Pre-commit Hooks:** Husky, Lint-staged
- **Code Formatting:** ESLint, Prettier
- **Version Control:** Git
- **Containerization:** Docker
- **Deployment:** Railway

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ASE-UIT/03.-Online-Notarization-Management-System-BE
   cd 03.-Online-Notarization-Management-System-BE
   ```

2. Install dependencies:

   ```bash
   yarn
   ```

3. Set up environment variables:

   Copy the `.env.example` file to `.env` and update the values as needed.

   ```bash
   cp .env.example .env
   ```

4. Start the server:

   ```bash
   yarn start
   ```

## Environment Variables

```bash
# Port number
PORT=3000
HOST=http://localhost

# MongoDB URL
MONGODB_URL=mongodb://127.0.0.1:27017/OnlineNotarization

# JWT Authentication
JWT_SECRET=thisisasamplesecret
JWT_ACCESS_EXPIRATION_MINUTES=30
JWT_REFRESH_EXPIRATION_DAYS=30
JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=10

# SMTP (Email) Configuration
SMTP_HOST=email-server
SMTP_PORT=587
SMTP_USERNAME=email-server-username
SMTP_PASSWORD=email-server-password
EMAIL_FROM=support@yourapp.com

# Google OAuth Configuration
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
GOOGLE_CALLBACK_URL=YOUR_GOOGLE_CALLBACK_URL

# GEMINI API Key (Google Generative AI)
GEMINI_API_KEY=YOUR_GEMINI_API_KEY

# Firebase Configuration
FIREBASE_TYPE=YOUR_FIREBASE_TYPE
FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
FIREBASE_PRIVATE_KEY_ID=YOUR_FIREBASE_PRIVATE_KEY_ID
FIREBASE_PRIVATE_KEY=YOUR_FIREBASE_PRIVATE_KEY
FIREBASE_CLIENT_EMAIL=YOUR_FIREBASE_CLIENT_EMAIL
FIREBASE_CLIENT_ID=YOUR_FIREBASE_CLIENT_ID
FIREBASE_AUTH_URI=YOUR_FIREBASE_AUTH_URI
FIREBASE_TOKEN_URI=YOUR_FIREBASE_TOKEN_URI
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=YOUR_FIREBASE_AUTH_PROVIDER_X509_CERT_URL
FIREBASE_CLIENT_X509_CERT_URL=YOUR_FIREBASE_CLIENT_X509_CERT_URL

# Client URL
CLIENT_URL=YOUR_CLIENT_URL

# Payment URL
PAYOS_CLIENT_ID=YOUR_PAYOS_CLIENT_ID
PAYOS_API_KEY=YOUR_PAYOS_API_KEY
PAYOS_CHECKSUM_KEY=YOUR_PAYOS_CHECKSUM_KEY
SERVER_URL=YOUR_SERVER_URL
VIETQR_URL=YOUR_VIETQR_URL

# Docker
DOCKER_USERNAME=YOUR_DOCKER_USERNAME
DOCKER_PASSWORD=YOUR_DOCKER_PASSWORD

# Alchemy
ALCHEMY_API_KEY=YOUR_ALCHEMY_API_KEY
PRIVATE_KEY=YOUR_ALCHEMY_PRIVATE_KEY

# Smart contract
CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS

# Pinata
PINATA_API_KEY=YOUR_PINATA_API_KEY
PINATA_SECRET_KEY=YOUR_PINATA_SECRET_KEY

```

## API Documentation

The API documentation can be accessed at `/v1/docs`. You can view the list of available APIs and their specifications by running the server and visiting `http://localhost:3000/v1/docs` in your browser.

## Testing

Run tests with:

```bash
yarn test
```

For coverage reports:

```bash
yarn test:coverage
```

## Docker

If you want to run the application using Docker, you can use the following commands:

```bash
# Run the Docker container in development mode
yarn docker:dev
# Run the Docker container in production mode
yarn docker:prod
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
