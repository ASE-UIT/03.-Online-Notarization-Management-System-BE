const express = require('express');
const auth = require('../../middlewares/auth');
const { adminController } = require('../../controllers');

const router = express.Router();

// Document metrics
router.get('/documents/:period', auth('getDocumentCount'), adminController.getDocumentCount);

// User metrics
router.get('/users/:period', auth('getUserCount'), adminController.getUserCount);

// Document metrics by notary field
router.get('/documents/fields/:period', auth('getDocumentsByNotaryField'), adminController.getDocumentsByNotaryField);

// Employee metrics
router.get('/employees/count', auth('getEmployeeCount'), adminController.getEmployeeCount);

router.get('/employees/list', auth('getEmployeeList'), adminController.getEmployeeList);

// Session metrics
router.get('/sessions/:period', auth('getSessionCount'), adminController.getSessionCount);

// Payment metrics
router.get('/payments/:period', auth('getPaymentTotal'), adminController.getPaymentTotal);

router.get('/payments/:period/service', auth('getPaymentTotalByService'), adminController.getPaymentTotalByService);

router.get(
  '/payments/:period/field',
  auth('getPaymentTotalByNotarizationField'),
  adminController.getPaymentTotalByNotarizationField
);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Admins
 *   description: Admin management and retrieval
 */
/**
 * @swagger
 * /admin/metrics/documents/{period}:
 *   get:
 *     summary: Get document count and percent document growth for a specified period
 *     description: Only admins can retrieve document count and growth percentage for the specified period.
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: period
 *         schema:
 *           type: string
 *           enum: [today, yesterday, this_week, this_month, this_year]
 *         required: true
 *         description: The period to retrieve document count and growth percentage for
 *     responses:
 *       "200":
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentPeriod:
 *                   type: object
 *                   properties:
 *                     period:
 *                       type: string
 *                       enum: [today, yesterday, this_week, this_month, this_year]
 *                       example: "today"
 *                     documentCount:
 *                       type: integer
 *                       example: 20
 *                 previousPeriod:
 *                   type: object
 *                   properties:
 *                     period:
 *                       type: string
 *                       example: "previous_today"
 *                     documentCount:
 *                       type: integer
 *                       example: 15
 *                 growthPercent:
 *                   type: number
 *                   example: 33.33
 *       "400":
 *         description: Bad Request - Invalid period parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/BadRequest'
 *       "401":
 *         description: Unauthorized access - invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden - the user doesn't have access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Forbidden'
 *       "404":
 *         description: Not found - endpoint does not exist
 */

/**
 * @swagger
 * /admin/metrics/users/{period}:
 *   get:
 *     summary: Get user count and growth percent for a specified period
 *     description: Retrieve user count and growth percentage based on the specified period. Only admins can access this information.
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: period
 *         schema:
 *           type: string
 *           enum: [today, yesterday, this_week, this_month, this_year]
 *         required: true
 *         description: The period to retrieve user metrics for
 *     responses:
 *       "200":
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentPeriod:
 *                   type: object
 *                   properties:
 *                     period:
 *                       type: string
 *                       enum: [today, yesterday, this_week, this_month, this_year]
 *                       example: "daily"
 *                     userCount:
 *                       type: integer
 *                       example: 25
 *                 previousPeriod:
 *                   type: object
 *                   properties:
 *                     period:
 *                       type: string
 *                       example: "previous_daily"
 *                     userCount:
 *                       type: integer
 *                       example: 20
 *                 growthPercent:
 *                   type: number
 *                   example: 25
 *       "400":
 *         description: Bad Request - Invalid period parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/BadRequest'
 *       "401":
 *         description: Unauthorized access - invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden - the user doesn't have access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Forbidden'
 *       "404":
 *         description: Not found - endpoint does not exist
 */

/**
 * @swagger
 * /admin/metrics/documents/fields/{period}:
 *   get:
 *     summary: Get document count by notary field for a specified period
 *     description: Retrieve the number of documents created for a given period, grouped by notary fields. Only admins can access this information.
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: period
 *         schema:
 *           type: string
 *           enum: [daily, weekly, monthly, yearly]
 *         required: true
 *         description: The period to filter documents by
 *     responses:
 *       "200":
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentPeriod:
 *                   type: object
 *                   properties:
 *                     period:
 *                       type: string
 *                       enum: [daily, weekly, monthly, yearly]
 *                       example: "daily"
 *                     totals:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           fieldName:
 *                             type: string
 *                             example: "Example Notary Field"
 *                           count:
 *                             type: integer
 *                             example: 5
 *                 previousPeriod:
 *                   type: object
 *                   properties:
 *                     period:
 *                       type: string
 *                       example: "previous_daily"
 *                     totals:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           fieldName:
 *                             type: string
 *                             example: "Example Notary Field"
 *                           count:
 *                             type: integer
 *                             example: 3
 *       "400":
 *         description: Bad Request - Invalid period parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/BadRequest'
 *       "401":
 *         description: Unauthorized access - invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden - the user doesn't have access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Forbidden'
 *       "404":
 *         description: Not found - endpoint does not exist
 */

/**
 * @swagger
 * /admin/metrics/employees/count:
 *   get:
 *     summary: Get the count of employees with role 'notary'
 *     description: Retrieve the total number of employees with the role of 'notary'.
 *     tags: [Admins]
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
 *                 notaryCount:
 *                   type: integer
 *                   description: The number of employees with the role 'notary'
 *                   example: 10
 *       "401":
 *         description: Unauthorized access - invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden - the user doesn't have access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Forbidden'
 *       "404":
 *         description: Not found - endpoint does not exist
 */

/**
 * @swagger
 * /admin/metrics/employees/list:
 *   get:
 *     summary: Get the list of employees with role 'notary' and 'secretary'
 *     description: Retrieve a list of employees with the role of 'notary' and 'secretary'.
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       "401":
 *         description: Unauthorized access - invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden - the user doesn't have access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Forbidden'
 *       "404":
 *         description: Not found - endpoint does not exist
 *       "500":
 *         description: Internal server error
 */

/**
 * @swagger
 * /admin/metrics/sessions/{period}:
 *   get:
 *     summary: Get session count and growth percent for a specified period
 *     description: Retrieve session count and growth percentage based on the specified period. Only admins can access this information.
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: period
 *         schema:
 *           type: string
 *           enum: [daily, weekly, monthly, yearly]
 *         required: true
 *         description: The period to retrieve session metrics for
 *     responses:
 *       "200":
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentPeriod:
 *                   type: object
 *                   properties:
 *                     period:
 *                       type: string
 *                       enum: [daily, weekly, monthly, yearly]
 *                       example: "daily"
 *                     sessionCount:
 *                       type: integer
 *                       example: 15
 *                 previousPeriod:
 *                   type: object
 *                   properties:
 *                     period:
 *                       type: string
 *                       example: "previous_daily"
 *                     sessionCount:
 *                       type: integer
 *                       example: 10
 *                 growthPercent:
 *                   type: number
 *                   example: 50
 *       "400":
 *         description: Bad Request - Invalid period parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/BadRequest'
 *       "401":
 *         description: Unauthorized access - invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden - the user doesn't have access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Forbidden'
 *       "404":
 *         description: Not found - endpoint does not exist
 */

/**
 * @swagger
 * /admin/metrics/payments/{period}:
 *   get:
 *     summary: Get total payment value for a specified period
 *     description: Retrieve the total value of payments created for the specified period. Only admins can access this information.
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: period
 *         schema:
 *           type: string
 *           enum: [daily, weekly, monthly, yearly]
 *         required: true
 *         description: The period to filter payments by
 *     responses:
 *       "200":
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 period:
 *                   type: string
 *                   example: "daily"
 *                 totalAmount:
 *                   type: number
 *                   example: 1000
 *       "400":
 *         description: Bad Request - Invalid period parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/BadRequest'
 *       "401":
 *         description: Unauthorized access - invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden - the user doesn't have access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Forbidden'
 *       "404":
 *         description: Not found - endpoint does not exist
 */

/**
 * @swagger
 * /admin/metrics/payments/{period}/service:
 *   get:
 *     summary: Get total payment value by service
 *     description: Retrieve the total value of payments created by service for a given period. Only admins can access this information.
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: period
 *         schema:
 *           type: string
 *           enum: [daily, weekly, monthly]
 *         required: true
 *         description: The period to filter payments by
 *     responses:
 *       "200":
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentPeriod:
 *                   type: object
 *                   properties:
 *                     period:
 *                       type: string
 *                       enum: [daily, weekly, monthly]
 *                       example: "daily"
 *                     totals:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           serviceName:
 *                             type: string
 *                             example: "Example Notarization Service"
 *                           totalAmount:
 *                             type: number
 *                             example: 1000
 *                 previousPeriod:
 *                   type: object
 *                   properties:
 *                     period:
 *                       type: string
 *                       example: "previous_daily"
 *                     totals:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           serviceName:
 *                             type: string
 *                             example: "Example Notarization Service"
 *                           totalAmount:
 *                             type: number
 *                             example: 900
 *       "401":
 *         description: Unauthorized access - invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden - the user doesn't have access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Forbidden'
 *       "404":
 *         description: Not found - endpoint does not exist
 */

/**
 * @swagger
 * /admin/metrics/payments/{period}/field:
 *   get:
 *     summary: Get total payment value by notarization field
 *     description: Retrieve the total value of payments created by notarization field for a given period. Only admins can access this information.
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: period
 *         schema:
 *           type: string
 *           enum: [daily, weekly, monthly]
 *         required: true
 *         description: The period to filter payments by
 *     responses:
 *       "200":
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentPeriod:
 *                   type: object
 *                   properties:
 *                     period:
 *                       type: string
 *                       enum: [daily, weekly, monthly]
 *                       example: "daily"
 *                     totals:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           fieldName:
 *                             type: string
 *                             example: "Example Notarization Field"
 *                           totalAmount:
 *                             type: number
 *                             example: 5000
 *                 previousPeriod:
 *                   type: object
 *                   properties:
 *                     period:
 *                       type: string
 *                       example: "previous_daily"
 *                     totals:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           fieldName:
 *                             type: string
 *                             example: "Example Notarization Field"
 *                           totalAmount:
 *                             type: number
 *                             example: 4500
 *       "401":
 *         description: Unauthorized access - invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden - the user doesn't have access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Forbidden'
 *       "404":
 *         description: Not found - endpoint does not exist
 */
