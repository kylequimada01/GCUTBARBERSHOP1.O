const express = require('express');
const validate = require('../../middlewares/validate');
const barberValidation = require('../../validations/barber.validation');
const barberController = require('../../controllers/barber.controller');
const userController = require('../../controllers/user.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/barbers').get(userController.getBarbers);

router
  .route('/:userId/assign')
  .patch(auth('manageUsers'), validate(barberValidation.assignBarber), barberController.assignBarber);

router
  .route('/:userId/update')
  .patch(auth('manageUsers'), validate(barberValidation.updateBarber), barberController.updateBarber);

router.route('/:userId/unassign').patch(auth('manageUsers'), barberController.unassignBarber);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Barbers
 *   description: Manage barbers (assign, update, unassign)
 */

/**
 * @swagger
 * /barbers/{userId}/assign:
 *   patch:
 *     summary: Assign a user as a barber
 *     description: Admins can assign a user as a barber.
 *     tags: [Barbers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Barber'
 *     responses:
 *       "200":
 *         description: Barber assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Barber'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /barbers/{userId}/update:
 *   patch:
 *     summary: Update barber details
 *     description: Admins can update barber details like title and image.
 *     tags: [Barbers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The barber ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Barber'
 *     responses:
 *       "200":
 *         description: Barber updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Barber'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /barbers/{userId}/unassign:
 *   patch:
 *     summary: Unassign a barber
 *     description: Admins can unassign a barber, reverting them to a regular user.
 *     tags: [Barbers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The barber ID
 *     responses:
 *       "200":
 *         description: Barber unassigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
