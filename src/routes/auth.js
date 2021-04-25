import express from 'express';
import AsyncHandler from 'express-async-handler';

import AuthController from '../controllers/authController';
import Validate from '../middleware/validator';

const authRoutes = express.Router();

authRoutes.post('/signup', Validate.signup, AsyncHandler(AuthController.register));
authRoutes.post('/signin', AsyncHandler(AuthController.signin));
authRoutes.get('/signout', AsyncHandler(AuthController.signout));
authRoutes.post('/refresh_token', AsyncHandler(AuthController.getAccessToken));
authRoutes.put('/activate/', AsyncHandler(AuthController.activateEmail));

export default authRoutes;
