const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createDocument = {
  body: Joi.object().keys({
    notarizationService: Joi.object()
      .keys({
        id: Joi.string().custom(objectId).required(),
        name: Joi.string().required(),
        fieldId: Joi.string().custom(objectId).required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
      })
      .required(),
    notarizationField: Joi.object()
      .keys({
        id: Joi.string().custom(objectId).required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
      })
      .required(),
    requesterInfo: Joi.object()
      .keys({
        citizenId: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        email: Joi.string().email().required(),
      })
      .required(),
    userId: Joi.string().custom(objectId),
  }),
};

const getHistoryByUserId = {
  headers: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

const forwardDocumentStatus = {
  headers: Joi.object().keys({
    userId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    action: Joi.string().required(),
  }),
};

module.exports = { createDocument, getHistoryByUserId, forwardDocumentStatus };
