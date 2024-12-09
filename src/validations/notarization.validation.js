const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createDocument = {
  body: Joi.object().keys({
    files: Joi.array().required(),
    notarizationService: Joi.object()
      .keys({
        id: Joi.string().custom(objectId).required(),
        name: Joi.string().required(),
        fieldId: Joi.string().custom(objectId).required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        required_documents: Joi.array().items(Joi.string()).required(),
        code: Joi.string().required(),
      })
      .required(),
    notarizationField: Joi.object()
      .keys({
        id: Joi.string().custom(objectId).required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
        code: Joi.string().required(),
        name_en: Joi.string().required(),
      })
      .required(),
    requesterInfo: Joi.object()
      .keys({
        fullName: Joi.string().required(),
        citizenId: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        email: Joi.string().email().required(),
      })
      .required(),
    userId: Joi.string().custom(objectId),
    amount: Joi.number().required(),
  }),
};

const getHistory = {
  headers: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

const forwardDocumentStatus = {
  headers: Joi.object().keys({
    userId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    action: Joi.string().valid('accept', 'reject').required(),
    feedback: Joi.string().when('action', {
      is: 'reject',
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    files: Joi.array().items(Joi.object()).optional(),
  }),
};

const approveSignatureByUser = {
  body: Joi.object().keys({
    documentId: Joi.string().required(),
  }),
};

const approveSignatureByNotary = {
  body: Joi.object().keys({
    documentId: Joi.string().required(),
  }),
};

const getHistoryByUserId = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

const getHistoryWithStatus = {
  headers: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

const getDocumentByRole = {
  query: Joi.object().keys({
    status: Joi.string().valid('processing', 'readyToSign', 'pendingSignature'),
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
  }),
};

const getDocument = {
  params: Joi.object().keys({
    documentId: Joi.string().custom(objectId).required(),
  }),
};
module.exports = {
  createDocument,
  getHistory,
  forwardDocumentStatus,
  approveSignatureByUser,
  approveSignatureByNotary,
  getHistoryByUserId,
  getHistoryWithStatus,
  getDocumentByRole,
  getDocument,
};
