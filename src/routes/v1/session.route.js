const express = require('express');
const multer = require('multer');
const httpStatus = require('http-status');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const sessionValidation = require('../../validations/session.validation');
const sessionController = require('../../controllers/session.controller');
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
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: 'JWT authorization header. Use `Bearer <token>` format.'
 *
 *   responses:
 *     BadRequest:
 *       description: Bad Request
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Invalid request parameters
 *     Unauthorized:
 *       description: Unauthorized access
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Unauthorized
 *     InternalServerError:
 *       description: Internal Server Error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 */

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Sessions management API
 */

router
  .route('/createSession')
  .post(auth('createSession'), validate(sessionValidation.createSession), sessionController.createSession);

router
  .route('/addUser/:sessionId')
  .patch(auth('addUserToSession'), validate(sessionValidation.addUserToSession), sessionController.addUserToSession);

router
  .route('/deleteUser/:sessionId')
  .patch(
    auth('deleteUserOutOfSession'),
    validate(sessionValidation.deleteUserOutOfSession),
    sessionController.deleteUserOutOfSession
  );

router
  .route('/joinSession/:sessionId')
  .post(auth('joinSession'), validate(sessionValidation.joinSession), sessionController.joinSession);

router.route('/getAllSessions').get(auth('getSessions'), sessionController.getAllSessions);

router
  .route('/getSessionsByDate')
  .get(auth('getSessions'), validate(sessionValidation.getSessionsByDate), sessionController.getSessionsByDate);

router
  .route('/getSessionsByMonth')
  .get(auth('getSessions'), validate(sessionValidation.getSessionsByMonth), sessionController.getSessionsByMonth);

router.route('/getActiveSessions').get(auth('getSessions'), sessionController.getActiveSessions);

router.route('/getSessionsByUserId').get(auth('getSessionsByUserId'), sessionController.getSessionsByUserId);

router
  .route('/getSessionBySessionId/:sessionId')
  .get(
    auth('getSessionBySessionId'),
    validate(sessionValidation.getSessionBySessionId),
    sessionController.getSessionBySessionId
  );

router.route('/upload-session-document/:sessionId').post(
  auth('uploadSessionDocument'),
  upload.array('files'),
  (req, res, next) => {
    req.body.files = req.files.map((file) => file.originalname);
    next();
  },
  validate(sessionValidation.uploadSessionDocument),
  sessionController.uploadSessionDocument
);

router
  .route('/send-session-for-notarization/:sessionId')
  .post(
    auth('sendSessionForNotarization'),
    validate(sessionValidation.sendSessionForNotarization),
    sessionController.sendSessionForNotarization
  );

/**
 * @swagger
 * /session/createSession:
 *   post:
 *     summary: Create session
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionName:
 *                 type: string
 *                 description: The name of the session
 *                 example: "Notarization Session"
 *               notaryField:
 *                 type: object
 *                 description: The field of the notary
 *                 example: {"name": "Notary Field"}
 *               notaryService:
 *                 type: object
 *                 description: The Service of the notary
 *                 example: {"name": "Notary Service"}
 *               startTime:
 *                 type: string
 *                 format: time
 *                 description: The time of session
 *                 example: "14:00"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: The date of session
 *                 example: "2024-10-10"
 *               endTime:
 *                 type: string
 *                 format: time
 *                 description: The time of session
 *                 example: "15:00"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: The date of session
 *                 example: "2024-10-10"
 *               users:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                 description: List of users related to the session
 *                 example: [{email: "abc@gmail.com"}, {email: "def@gmail.com"}]
 *             required:
 *               - sessionName
 *               - startTime
 *               - startDate
 *               - endTime
 *               - endDate
 *               - users
 *               - notaryField
 *               - notaryService
 *     responses:
 *       "201":
 *         description: Session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionName:
 *                   type: string
 *                   example: "Notarization Session"
 *                 notaryField:
 *                    type: string
 *                    example: "Notary Field"
 *                 notaryService:
 *                    type: string
 *                    example: "Notary Service"
 *                 startTime:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-10T20:00:00Z"
 *                 startDate:
 *                   type: string
 *                   format: date
 *                   example: "2024-10-10"
 *                 endTime:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-10T21:00:00Z"
 *                 endDate:
 *                   type: string
 *                   format: date
 *                   example: "2024-10-10"
 *                 users:
 *                   type: array
 *                   items:
 *                      type: object
 *                      properties:
 *                        email:
 *                          type: string
 *                   example: "abc@gmail.com"
 *                 createdBy:
 *                   type: string
 *
 *       "400":
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request parameters"
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       "500":
 *         description: Internal Server Error - Failed to create session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to create session"
 * */
/**
 * @swagger
 * /session/addUser/{sessionId}:
 *   patch:
 *     summary: Add user to session
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emails:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of email addresses add to the session
 *                 example: ["abc@gmail.com", "def@gmail.com"]
 *             required:
 *               - emails
 *     responses:
 *       "201":
 *         description: User was added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionId:
 *                   type: string
 *                   example: "66fe4c6b76f99374f4c87165"
 *                 emails:
 *                   type: array
 *                   items:
 *                      type: string
 *                   example: "abc@gmail.com"
 *       "400":
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request parameters"
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       "500":
 *         description: Internal Server Error - Failed to add user to session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to add user to session"
 * */
/**
 * @swagger
 * /session/deleteUser/{sessionId}:
 *   patch:
 *     summary: Delete user from session
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address to delete from the session
 *                 example: "abc@gmail.com"
 *             required:
 *               - email
 *     responses:
 *       "200":
 *         description: User was deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionId:
 *                   type: string
 *                   example: "66fe4c6b76f99374f4c87165"
 *                 email:
 *                   type: string
 *                   example: "abc@gmail.com"
 *       "400":
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request parameters"
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       "500":
 *         description: Internal Server Error - Failed to delete user from session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to delete user from session"
 * */
/**
 * @swagger
 * /session/joinSession/{sessionId}:
 *   post:
 *     summary: Join session
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the session
 *     requestBody:
 *       action: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 description: The action of the session
 *                 example: "accept"
 *             required:
 *               - action
 *     responses:
 *       "200":
 *         description: Session joined successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionId:
 *                   type: string
 *                   example: "66fe4c6b76f99374f4c87165"
 *                 email:
 *                   type: array
 *                   items:
 *                      type: string
 *                   example: "abc@gmail.com"
 *       "400":
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request parameters"
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       "500":
 *         description: Internal Server Error - Failed to join session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to join session"
 * */
/**
 * @swagger
 * /session/getAllSessions:
 *   get:
 *     summary: Get all sessions
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: All sessions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sessionName:
 *                     type: string
 *                     example: "Notarization Session"
 *                   notaryField:
 *                      type: string
 *                      example: "Notary Field"
 *                   notaryService:
 *                      type: string
 *                      example: "Notary Service"
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-10-10T20:00:00Z"
 *                   startDate:
 *                     type: string
 *                     format: date
 *                     example: "2024-10-10"
 *                   endTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-10-10T21:00:00Z"
 *                   endDate:
 *                     type: string
 *                     format: date
 *                     example: "2024-10-10"
 *                   email:
 *                     type: array
 *                     items:
 *                        type: string
 *                     example: "abc@gmail.com"
 *                   createdBy:
 *                     type: string
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       "500":
 *         description: Internal Server Error - Failed to retrieve sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve sessions"
 * */
/**
 * @swagger
 * /session/getSessionsByDate:
 *   get:
 *     summary: Get sessions by date
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The date of the sessions
 *         example: "2024-10-10"
 *     responses:
 *       "200":
 *         description: Sessions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sessionName:
 *                     type: string
 *                     example: "Notarization Session"
 *                   notaryField:
 *                      type: string
 *                      example: "Notary Field"
 *                   notaryService:
 *                      type: string
 *                      example: "Notary Service"
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-10-10T20:00:00Z"
 *                   startDate:
 *                     type: string
 *                     format: date
 *                     example: "2024-10-10"
 *                   endTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-10-10T21:00:00Z"
 *                   endDate:
 *                     type: string
 *                     format: date
 *                     example: "2024-10-10"
 *                   email:
 *                     type: array
 *                     items:
 *                        type: string
 *                     example: "abc@gmail.com"
 *                   createdBy:
 *                     type: string
 *       "400":
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request parameters"
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       "500":
 *         description: Internal Server Error - Failed to retrieve sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve sessions"
 * */
/**
 * @swagger
 * /session/getSessionsByMonth:
 *   get:
 *     summary: Get sessions by month
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The month of the sessions
 *         example: "2024-10"
 *     responses:
 *       "200":
 *         description: Sessions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sessionName:
 *                     type: string
 *                     example: "Notarization Session"
 *                   notaryField:
 *                      type: string
 *                      example: "Notary Field"
 *                   notaryService:
 *                      type: string
 *                      example: "Notary Service"
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-10-10T20:00:00Z"
 *                   startDate:
 *                     type: string
 *                     format: date
 *                     example: "2024-10-10"
 *                   endTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-10-10T21:00:00Z"
 *                   endDate:
 *                     type: string
 *                     format: date
 *                     example: "2024-10-10"
 *                   email:
 *                     type: array
 *                     items:
 *                        type: string
 *                     example: "abc@gmail.com"
 *                   createdBy:
 *                     type: string
 *       "400":
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request parameters"
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       "500":
 *         description: Internal Server Error - Failed to retrieve sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve sessions"
 * */
/**
 * @swagger
 * /session/getActiveSessions:
 *   get:
 *     summary: Get active sessions
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Active sessions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sessionName:
 *                     type: string
 *                     example: "Notarization Session"
 *                   notaryField:
 *                      type: string
 *                      example: "Notary Field"
 *                   notaryService:
 *                      type: string
 *                      example: "Notary Service"
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-10-10T20:00:00Z"
 *                   startDate:
 *                     type: string
 *                     format: date
 *                     example: "2024-10-10"
 *                   endTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-10-10T21:00:00Z"
 *                   endDate:
 *                     type: string
 *                     format: date
 *                     example: "2024-10-10"
 *                   email:
 *                     type: array
 *                     items:
 *                        type: string
 *                     example: "abc@gmail.com"
 *                   createdBy:
 *                     type: string
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       "500":
 *         description: Internal Server Error - Failed to retrieve sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve sessions"
 * */
/**
 * @swagger
 * /session/getSessionsByUserId:
 *   get:
 *     summary: Get sessions by user id
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Sessions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sessionName:
 *                     type: string
 *                     example: "Notarization Session"
 *                   notaryField:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Notary Field"
 *                   notaryService:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Notary Service"
 *                   startTime:
 *                     type: string
 *                     format: time
 *                     example: "14:00"
 *                   startDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-10-10T14:00:00Z"
 *                   endTime:
 *                     type: string
 *                     format: time
 *                     example: "15:00"
 *                   endDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-10-10T15:00:00Z"
 *                   users:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         email:
 *                           type: string
 *                           example: "abc@gmail.com"
 *                         status:
 *                           type: string
 *                           example: "pending"
 *                         _id:
 *                           type: string
 *                           example: "671826e21c0db33a40e7e786"
 *                   createdBy:
 *                     type: string
 *                     example: "67180dde1a53252834c466bd"
 *       "400":
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request parameters"
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       "500":
 *         description: Internal Server Error - Failed to retrieve sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve sessions"
 */

/**
 * @swagger
 * /session/getSessionBySessionId/{sessionId}:
 *   get:
 *     summary: Get sessions by session id
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the session
 *     responses:
 *       "201":
 *         description: Session retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionName:
 *                   type: string
 *                   example: "Notarization Session"
 *                 notaryField:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Notary Field"
 *                 notaryService:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Notary Service"
 *                 startTime:
 *                   type: string
 *                   format: time
 *                   example: "14:00"
 *                 startDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-10T14:00:00Z"
 *                 endTime:
 *                   type: string
 *                   format: time
 *                   example: "15:00"
 *                 endDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-10T15:00:00Z"
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                         example: "abc@gmail.com"
 *                       status:
 *                         type: string
 *                         example: "pending"
 *                       _id:
 *                         type: string
 *                         example: "671826e21c0db33a40e7e786"
 *                 createdBy:
 *                   type: string
 *                   example: "67180dde1a53252834c466bd"
 *       "400":
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request parameters"
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       "500":
 *         description: Internal Server Error - Failed to retrieve sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve sessions"
 */

/**
 * @swagger
 * /session/upload-session-document/{sessionId}:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Sessions
 *     summary: Upload documents to a session
 *     description: Uploads files to a specific session and returns URLs of the uploaded files.
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the session to upload documents to.
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
 *                 description: The files to be uploaded. Supports multiple files.
 *
 *     responses:
 *       '200':
 *         description: Successfully uploaded documents to the session.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Files uploaded successfully"
 *                 uploadedFiles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       filename:
 *                         type: string
 *                         example: "1633972176823-document.pdf"
 *                       firebaseUrl:
 *                         type: string
 *                         example: "https://storage.googleapis.com/bucket-name/folder-name/1633972176823-document.pdf"
 *
 *       '400':
 *         description: Bad request. Session ID is invalid or no files are provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No files provided"
 *       '403':
 *         description: Forbidden. User is not part of this session.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User is not part of this session"
 *       '404':
 *         description: Not found. Session or user not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Session not found"
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while uploading files"
 */

/**
 * @swagger
 * /session/send-session-for-notarization/{sessionId}:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Sessions
 *     summary: Send session for notarization
 *     description: Sends a session for notarization if it meets the required criteria, such as having files attached and being requested by the session creator.
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the session to be sent for notarization.
 *     responses:
 *       '200':
 *         description: Successfully sent session for notarization.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Session sent for notarization successfully"
 *                 session:
 *                   type: object
 *                   properties:
 *                     sessionId:
 *                       type: string
 *                       example: "123456789"
 *                     notaryField:
 *                       type: object
 *                       example: {"fieldName": "Sample Field"}
 *                     notaryService:
 *                       type: object
 *                       example: {"serviceName": "Sample Service"}
 *                     sessionName:
 *                       type: string
 *                       example: "Sample Session Name"
 *                     startTime:
 *                       type: string
 *                       example: "10:00 AM"
 *                     startDate:
 *                       type: string
 *                       format: date
 *                       example: "2024-01-01"
 *                     endTime:
 *                       type: string
 *                       example: "11:00 AM"
 *                     endDate:
 *                       type: string
 *                       format: date
 *                       example: "2024-01-01"
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           email:
 *                             type: string
 *                             example: "user@example.com"
 *                           status:
 *                             type: string
 *                             enum: [pending, accepted, rejected]
 *                             example: "pending"
 *                     createdBy:
 *                       type: string
 *                       example: "609dcd123b5f3b001d9e4567"
 *                     files:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           filename:
 *                             type: string
 *                             example: "document.pdf"
 *                           firebaseUrl:
 *                             type: string
 *                             example: "https://example.com/document.pdf"
 *                           createAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-01-01T10:00:00Z"
 *                 status:
 *                   type: string
 *                   example: "pending"
 *       '400':
 *         description: Bad request. Possible issues include invalid session ID or no documents attached.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid session ID or No documents to send for notarization"
 *       '403':
 *         description: Forbidden. The user is not authorized to send this session for notarization.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Only the session creator can send for notarization"
 *       '404':
 *         description: Not found. The specified session could not be located.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Session not found"
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while sending session for notarization"
 */

module.exports = router;
