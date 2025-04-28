import express from 'express';
import { verifyAdmin } from '../auth/jwt.verifyAdmin.js';
import { userControllers } from '../controllers/user.controller.js';
import { verifyUser } from '../auth/jwt.verifyUser.js';
const router = express.Router();
router.route('/getAllUsers').get(verifyAdmin, userControllers.getAllUsers);
router.route('/register').post(userControllers.register);
router.route('/login').post(userControllers.login);
router.route('/logout').delete(verifyUser,userControllers.logout);
router
 .route('/:id')
 .get(verifyAdmin,userControllers.getUser)
 .put(verifyUser,userControllers.updateUser)
 .delete(verifyUser,userControllers.deleteUser);
export const usersRoutes = router;
