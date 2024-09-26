const express = require('express');
const multer = require('multer');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const notarizationValidation = require('../../validations/notarization.validation');
const notarizationController = require('../../controllers/notarization.controller');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: 'JWT authorization header. Use `Bearer <token>` format.'
 */

/**
 * @swagger
 * tags:
 *   name: Notarizations
 *   description: Notarization document management API
 */

router
  .route('/upload-files')
  .post(
    auth('uploadDocuments'),
    upload.array('files'),
    validate(notarizationValidation.createDocument),
    notarizationController.createDocument
  );

/**
 * @swagger
 * /notarization/upload-files:
 *   post:
 *     summary: Upload notarization documents
 *     tags: [Notarizations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: The files to upload
 *               notaryService:
 *                 type: string
 *                 description: Name of the notary service
 *                 example: Example Notary Service
 *               notaryField:
 *                 type: string
 *                 description: Field of the notary service
 *                 example: Example Notary Field
 *               requesterInfo:
 *                 type: object
 *                 properties:
 *                   citizenId:
 *                     type: string
 *                     example: 123456789012
 *                   phoneNumber:
 *                     type: string
 *                     example: 0941788455
 *                   email:
 *                     type: string
 *                     example: 123@gmail.com
 *                 required:
 *                   - citizenId
 *                   - phoneNumber
 *                   - email
 *             required:
 *               - files
 *               - notaryService
 *               - notaryField
 *               - requesterInfo
 *           example:
 *             files: [file1.pdf, file2.docx]
 *             notaryService: Example Notary Service
 *             notaryField: Example Notary Field
 *             requesterInfo:
 *               citizenId: 123456789012
 *               phoneNumber: 0941788455
 *               email: 123@gmail.com
 *     responses:
 *       "201":
 *         description: Documents uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID of the created document
 *                   example: 66f1818416c9ba1bfc053c3c
 *                 notaryService:
 *                   type: string
 *                   example: Vay-Mượn Tài Sản
 *                 notaryField:
 *                   type: string
 *                   example: Vay mượn
 *                 requesterInfo:
 *                   type: object
 *                   properties:
 *                     citizenId:
 *                       type: string
 *                       example: 123456789012
 *                     phoneNumber:
 *                       type: string
 *                       example: 0941788455
 *                     email:
 *                       type: string
 *                       example: 123@gmail.com
 *                 files:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 66f1818416c9ba1bfc053c3c
 *                       filename:
 *                         type: string
 *                         example: file1.pdf
 *                       firebaseUrl:
 *                         type: string
 *                         example: https://storage.googleapis.com/file-url.pdf
 *       "400":
 *         description: Bad Request - No files provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No files provided
 *       "500":
 *         description: Internal Server Error - Failed to upload files
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to upload files
 */

module.exports = router;