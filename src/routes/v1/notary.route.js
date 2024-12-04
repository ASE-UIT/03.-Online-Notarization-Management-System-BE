const express = require('express');
const auth = require('../../middlewares/auth');
const { notaryController } = require('../../controllers');

const router = express.Router();

router.get('/metrics/processing', auth('dashboard'), notaryController.getProcessingSessionsDocuments);

router.get('/metrics/digitalSignature', auth('dashboard'), notaryController.getSignatureSessionsDocuments);

router.get('/metrics/notaryApprovals', auth('dashboard'), notaryController.getNotaryApproved);

router.get('/metrics/acceptanceRate', auth('dashboard'), notaryController.getAcceptanceRate);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Notary
 *   description: Notary management
 */

/**
 * @swagger
 * components:
 *   responses:
 *     BadRequest:
 *       description: Bad request due to invalid or missing query parameters
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Invalid request parameters"
 *               error:
 *                 type: string
 *                 example: "BadRequest"
 *     Unauthorized:
 *       description: Unauthorized access - invalid or missing token
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Unauthorized"
 *               error:
 *                 type: string
 *                 example: "Unauthorized"
 *     Forbidden:
 *       description: Forbidden - user does not have permission to access this resource
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Forbidden access"
 *               error:
 *                 type: string
 *                 example: "Forbidden"
 *     NotFound:
 *       description: Resource not found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Resource not found"
 *               error:
 *                 type: string
 *                 example: "NotFound"
 *     InternalServerError:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "An unexpected error occurred"
 *               error:
 *                 type: string
 *                 example: "InternalServerError"
 */

/**
 * @swagger
 * /notary/metrics/processing:
 *   get:
 *     summary: Get total combined session and document counts for "processing" status
 *     description: Retrieve the total combined counts of sessions and documents (from the beginning until now) with "processing" status, and the percentage change between the current month and the previous month. Accessible only to notary.
 *     tags: [Notary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total count of sessions and documents with "processing" status
 *                   example: 1200
 *                 growthPercent:
 *                   type: number
 *                   description: Growth percentage of the total sessions and documents between the current month and previous month
 *                   example: 11.11
 *       "401":
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Forbidden'
 *       "404":
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/NotFound'
 *       "500":
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /notary/metrics/digitalSignature:
 *   get:
 *     summary: Get total combined session and document counts for "digitalSignature" status
 *     description: Retrieve the total combined counts of sessions and documents (from the beginning until now) with "digitalSignature" status, and the percentage change between the current month and the previous month. Accessible only to notary.
 *     tags: [Notary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total count of sessions and documents with "digitalSignature" status
 *                   example: 1200
 *                 change:
 *                   type: number
 *                   description: Growth percentage of the total sessions and documents between the current month and previous month
 *                   example: 11.11
 *       "401":
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Forbidden'
 *       "404":
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/NotFound'
 *       "500":
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /notary/metrics/notaryApprovals:
 *   get:
 *     summary: Get total approved sessions and documents for notary
 *     description: Retrieve the total count of approved sessions and documents for the notary, including growth percentage between the current month and the previous month. Accessible only to notary users.
 *     tags: [Notary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total approved sessions and documents from the beginning until now
 *                   example: 1500
 *                 growthPercent:
 *                   type: number
 *                   description: Growth percentage of approved sessions and documents between the current and previous months
 *                   example: 25.50
 *       "401":
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Forbidden'
 *       "404":
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/NotFound'
 *       "500":
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /notary/metrics/acceptanceRate:
 *   get:
 *     summary: Get total approved sessions and documents for notary
 *     description: Retrieve the total count of approved sessions and documents for the notary, including the growth percentage between the current month and the previous month. This endpoint is accessible only to notary users.
 *     tags: [Notary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total count of approved sessions and documents from the beginning until now
 *                   example: 1500
 *                 growthPercent:
 *                   type: number
 *                   description: Growth percentage of approved sessions and documents between the current and previous months
 *                   example: 25.50
 *       "401":
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Forbidden'
 *       "404":
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/NotFound'
 *       "500":
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/InternalServerError'
 */
