import express from 'express';
import { ordersController } from '../controllers/orders.controller.js';
import { verifyAdmin } from '../auth/jwt.verifyAdmin.js';
import { verifyUser } from '../auth/jwt.verifyUser.js';
const router = express.Router();
router.route('/').get(verifyAdmin, ordersController.getAllOrders);
router.route('/deleteOrder/:id').delete(verifyAdmin, ordersController.deleteOrder);
router.route('/updateOrder').put(verifyAdmin, ordersController.updateOrder);
router.route('/ordersCount').get(verifyAdmin, ordersController.ordersCount);
router.route('/addOrder').post(verifyUser, ordersController.addOrder);
router.route('/history/:id').get(verifyUser, ordersController.ordersHistory);

export const ordersRoutes = router;
