const httpStatus = require('http-status');
const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
const { notarizationService } = require('../services');

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Controller function to create a document
const createDocument = catchAsync(async (req, res) => {
  const userId = req.user.id;

  if (!isValidEmail(req.body.requesterInfo.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid email address');
  }

  const document = await notarizationService.createDocument({ ...req.body }, req.files, userId);

  await notarizationService.createStatusTracking(document._id, 'pending');

  res.status(httpStatus.CREATED).send(document);
});

const getHistory = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const history = await notarizationService.getHistoryByUserId(userId);
  res.status(httpStatus.OK).send(history);
});

const getHistoryByUserId = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const history = await notarizationService.getHistoryByUserId(userId);
  res.status(httpStatus.OK).send(history);
});

const getHistoryWithStatus = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const history = await notarizationService.getHistoryWithStatus(userId);
  res.status(httpStatus.OK).send(history);
});

const getDocumentStatus = catchAsync(async (req, res) => {
  const { documentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(documentId) || !(await notarizationService.getDocumentStatus(documentId))) {
    return res.status(httpStatus.NOT_FOUND).json({
      code: httpStatus.NOT_FOUND,
      message: 'Document not found or does not have notarization status',
    });
  }

  const status = await notarizationService.getDocumentStatus(documentId);

  res.status(httpStatus.OK).json(status);
});

const getDocumentByRole = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['limit', 'page']);

  const result = await notarizationService.getDocumentByRole({
    ...filter,
    ...options,
  });

  res.status(httpStatus.OK).send(result);
});

const forwardDocumentStatus = catchAsync(async (req, res) => {
  const { documentId } = req.params;
  const { action, feedback, files } = req.body;
  const { role } = req.user;
  const userId = req.user.id;

  const updatedStatus = await notarizationService.forwardDocumentStatus(documentId, action, role, userId, feedback, files);

  res.status(httpStatus.OK).send(updatedStatus);
});
const getApproveHistory = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const approveHistory = await notarizationService.getApproveHistory(userId);
  res.status(httpStatus.OK).send(approveHistory);
});

const getAllNotarizations = catchAsync(async (req, res) => {
  const filter = {};
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const notarizations = await notarizationService.getAllNotarizations(filter, options);
  res.status(httpStatus.OK).send(notarizations);
});

const approveSignatureByUser = catchAsync(async (req, res) => {
  const { documentId } = req.body;
  const signatureImage = req.file.originalname;
  const requestApproved = await notarizationService.approveSignatureByUser(documentId, signatureImage);
  res.status(httpStatus.CREATED).send(requestApproved);
});

const approveSignatureByNotary = catchAsync(async (req, res) => {
  const requestApproved = await notarizationService.approveSignatureByNotary(req.body.documentId, req.user.id);
  res.status(httpStatus.OK).send(requestApproved);
});

const getDocumentById = catchAsync(async (req, res) => {
  const document = await notarizationService.getDocumentById(req.params.documentId);
  res.status(httpStatus.OK).send(document);
});

module.exports = {
  createDocument,
  getHistory,
  getHistoryByUserId,
  getDocumentStatus,
  getDocumentByRole,
  forwardDocumentStatus,
  getApproveHistory,
  getAllNotarizations,
  approveSignatureByUser,
  approveSignatureByNotary,
  getHistoryWithStatus,
  getDocumentById,
};
