const express = require('express');
const httpStatus = require('http-status');
const multer = require('multer');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const notarizationValidation = require('../../validations/notarization.validation');
const notarizationController = require('../../controllers/notarization.controller');
const ApiError = require('../../utils/ApiError');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|pdf/;
    const mimeType = allowedFileTypes.test(file.mimetype);
    const extname = allowedFileTypes.test(file.originalname.split('.').pop());

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb(new ApiError(httpStatus.BAD_REQUEST, 'Only images and PDFs are allowed'));
  },
});

/**
 * @swagger
 * tags:
 *   name: Notarizations
 *   description: Notarization document management API
 */

router.route('/upload-files').post(
  auth('uploadDocuments'),
  upload.array('files'),
  (req, res, next) => {
    console.log('Uploaded files:', req.files);
    req.body.notarizationService = JSON.parse(req.body.notarizationService);
    req.body.notarizationField = JSON.parse(req.body.notarizationField);
    req.body.requesterInfo = JSON.parse(req.body.requesterInfo);
    req.body.amount = Number(req.body.amount);

    req.body.files = req.files.map((file) => file.originalname);

    next();
  },
  validate(notarizationValidation.createDocument),
  notarizationController.createDocument
);

router
  .route('/document/:documentId')
  .get(auth('getDocument'), validate(notarizationValidation.getDocument), notarizationController.getDocumentById);

router
  .route('/history')
  .get(auth('viewNotarizationHistory'), validate(notarizationValidation.getHistory), notarizationController.getHistory);

router
  .route('/get-history-by-user-id/:userId')
  .get(
    auth('viewNotarizationHistoryByUserId'),
    validate(notarizationValidation.getHistoryByUserId),
    notarizationController.getHistoryByUserId
  );

router
  .route('/get-history-with-status')
  .get(
    auth('viewNotarizationHistory'),
    validate(notarizationValidation.getHistoryWithStatus),
    notarizationController.getHistoryWithStatus
  );

router.route('/getStatusById/:documentId').get(notarizationController.getDocumentStatus);

router.route('/getDocumentByRole').get(auth('getDocumentsByRole'), notarizationController.getDocumentByRole);

router.route('/forwardDocumentStatus/:documentId').patch(
  auth('forwardDocumentStatus'),
  upload.array('files'),
  (req, res, next) => {
    const files = req.files || [];
    req.body.files = files;
    next();
  },
  validate(notarizationValidation.forwardDocumentStatus),
  notarizationController.forwardDocumentStatus
);

router.route('/getAllNotarization').get(auth('getAllNotarizations'), notarizationController.getAllNotarizations);

router.route('/getApproveHistory').get(auth('getApproveHistory'), notarizationController.getApproveHistory);

router
  .route('/approve-signature-by-user')
  .post(
    auth('approveSignatureByUser'),
    upload.single('signatureImage'),
    validate(notarizationValidation.approveSignatureByUser),
    notarizationController.approveSignatureByUser
  );

router
  .route('/approve-signature-by-notary')
  .post(
    auth('approveSignatureByNotary'),
    upload.none(),
    validate(notarizationValidation.approveSignatureByNotary),
    notarizationController.approveSignatureByNotary
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
 *                 description: The files to upload (e.g., PDF, DOCX)
 *                 example: [file1.pdf, file2.docx]
 *               notarizationField:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ObjectId of the related notarization field
 *                     example: "6746f07ccc390609e20d08be"
 *                   name:
 *                     type: string
 *                     description: The name of the notarization field
 *                     example: "Lĩnh vực Vay - mượn tài sản"
 *                   description:
 *                     type: string
 *                     description: The description of the notarization field
 *                     example: "Bao gồm các dịch vụ công chứng liên quan đến việc vay mượn tài sản, đảm bảo tính pháp lý và thỏa thuận giữa các bên."
 *                   name_en:
 *                     type: string
 *                     description: The English name of the notarization field
 *                     example: "Asset Lending and Borrowing"
 *                   code:
 *                     type: string
 *                     description: The code of the notarization field
 *                     example: "asset_lending_borrowing"
 *               notarizationService:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ObjectId of the related notarization service
 *                     example: "6746f2dbcc390609e20d08dc"
 *                   name:
 *                     type: string
 *                     description: The name of the notarization service
 *                     example: "Công chứng hợp đồng vay tài sản"
 *                   fieldId:
 *                     type: string
 *                     description: ObjectId of the related notarization field
 *                     example: "6746f07ccc390609e20d08be"
 *                   description:
 *                     type: string
 *                     description: "> Giấy tờ tùy thân: Chứng minh nhân dân (CMND) hoặc Căn cước công dân (CCCD) hoặc Hộ chiếu của bên vay và bên cho vay.\n+ Hộ khẩu thường trú: Bản sao có chứng thực của cả hai bên, hoặc sổ tạm trú nếu không có hộ khẩu tại địa phương.\n+ Giấy xác nhận tình trạng hôn nhân (nếu tài sản chung của vợ chồng).\n+ Hợp đồng vay tài sản (soạn sẵn hoặc nhờ văn phòng công chứng soạn thảo).\n+ Các thông tin về khoản vay: Số tiền vay, lãi suất, phương thức trả nợ, thời hạn vay."
 *                   price:
 *                     type: number
 *                     description: The price of the notarization service
 *                     example: 10000
 *                   required_documents:
 *                     type: array
 *                     items:
 *                       type: string
 *                       description: The requested documents for the notarization service
 *                     example: ["identity_doc", "residence_book", "marriage_cert", "loan_contract", "loan_info"]
 *                   code:
 *                     type: string
 *                     description: The code of the notarization service
 *                     example: "Loan_Contract"
 *               requesterInfo:
 *                 type: object
 *                 properties:
 *                   fullName:
 *                     type: string
 *                     description: Full name of the requester
 *                     example: "John Doe"
 *                   citizenId:
 *                     type: string
 *                     description: Citizen ID of the requester
 *                     example: "123456789"
 *                   phoneNumber:
 *                     type: string
 *                     description: Phone number of the requester
 *                     example: "+1234567890"
 *                   email:
 *                     type: string
 *                     description: Email of the requester
 *                     example: "requester@example.com"
 *               amount:
 *                 type: number
 *                 description: Amount of the document to notarize
 *                 example: 10
 *     responses:
 *       "201":
 *         description: Documents uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notarizations'
 *       "400":
 *         description: Bad Request - Invalid data provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid notarization service ID or field ID / No files provided"
 *       "500":
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to upload documents"
 */

/**
 * @swagger
 * /notarization/getStatusById/{documentId}:
 *   get:
 *     summary: Get the status of a document by ID
 *     tags: [Notarizations]
 *     parameters:
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the document to retrieve status
 *     responses:
 *       "200":
 *         description: Document status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notarizations'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /notarization/getDocumentByRole:
 *   get:
 *     summary: Get documents by user role
 *     description: Retrieve documents based on user role and status filters
 *     tags: [Notarizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [processing, readyToSign, pendingSignature]
 *         required: true
 *         description: Filter documents by status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Maximum number of documents per page
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 documents:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notarizations'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 7
 *                     totalDocuments:
 *                       type: integer
 *                       example: 66
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   "500":
 *    $ref: '#/components/responses/InternalServerError'
 */
/**
 * @swagger
 * /notarization/forwardDocumentStatus/{documentId}:
 *   patch:
 *     summary: Forward the status of a notarization document by document ID
 *     tags: [Notarizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the document to update status
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [accept, reject]
 *                 description: The action to perform on the document
 *               feedback:
 *                 type: string
 *                 description: Feedback for rejecting the document (required if action is 'reject')
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Output files to be uploaded
 *     responses:
 *       "200":
 *         description: Successfully updated the document status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 documentId:
 *                   type: string
 *                 outputFiles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       filename:
 *                         type: string
 *                       firebaseUrl:
 *                         type: string
 *                       transactionHash:
 *                         type: string
 *                         nullable: true
 *                       uploadedAt:
 *                         type: string
 *                         format: date-time
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /notarization/getApproveHistory:
 *   get:
 *     summary: Retrieve the approval history of notarization documents
 *     tags: [Notarizations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Successfully retrieved approval history
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   documentId:
 *                     type: string
 *                     example: "66f462fa57b33d48e47ab55f"
 *                   status:
 *                     type: string
 *                     example: "approved"
 *                   approvedBy:
 *                     type: string
 *                     example: "userId123"
 *                   approvedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-09-26T08:09:42.039Z"
 *                   comments:
 *                     type: string
 *                     example: "Document approved successfully."
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden - User does not have permission to access this resource
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You do not have permission to access this resource."
 *       "404":
 *         description: Not Found - Approval history not found for the specified document
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Approval history not found."
 *       "500":
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve approval history"
 */

/**
 * @swagger
 * /notarization/getAllNotarization:
 *   get:
 *     summary: Get allnotarizations
 *     description: Only admins can retrieve all notarizations.
 *     tags: [Notarizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of notarization
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notarizations'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /notarization/approve-signature-by-user:
 *   post:
 *     summary: Approve signature by user
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
 *               documentId:
 *                 type: string
 *                 description: ID of the document to approve
 *               signatureImage:
 *                 type: string
 *                 format: binary
 *                 description: Signature image of the document
 *     responses:
 *       "200":
 *         description: Signature approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Signature approved successfully"
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /notarization/approve-signature-by-notary:
 *   post:
 *     summary: Approve signature by notary
 *     tags: [Notarizations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documentId:
 *                 type: string
 *                 description: ID of the document to approve
 *     responses:
 *       "200":
 *         description: Signature approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Signature approved successfully"
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /notarization/history:
 *   get:
 *     summary: Get notarization history by user ID
 *     tags: [Notarizations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Notarization history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notarizations'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /notarization/get-history-by-user-id/{userId}:
 *   get:
 *     summary: Get notarization history by user ID
 *     tags: [Notarizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: User ID for retrieving notarization history
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Notarization history for the user retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notarizations'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /notarization/get-history-with-status:
 *   get:
 *     summary: Get notarization history with status
 *     tags: [Notarizations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Notarization history with status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notarizations'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /notarization/document/{documentId}:
 *   get:
 *     summary: Get notarization document by ID
 *     tags: [Notarizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: documentId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the document to retrieve
 *     responses:
 *       "200":
 *         description: Notarization document retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notarizations'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */

module.exports = router;
