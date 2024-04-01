import express from 'express';
const router = express.Router();
import UserController from '../controllers/userController.js';
 
router.post("/registre",UserController.userRegistration)
router.post("/login",UserController.userLogin)
router.post("/send-rest-password-email",UserController.sendUserPasswardRestEmail)
router.post("/reset-password/:id/:token",UserController.userPasswordReset)












export default router