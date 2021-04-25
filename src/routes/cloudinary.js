import express from 'express';
import AsyncHandler from 'express-async-handler';

import Cloudinary from '../controllers/cloudinary';
import auth from '../middleware/auth';
import authAdmin from '../middleware/authAdmin';

const cloudinaryRoutes = express.Router();

cloudinaryRoutes.post('/upload', auth, authAdmin, AsyncHandler(Cloudinary.upload));
cloudinaryRoutes.delete('/remove', auth, authAdmin, AsyncHandler(Cloudinary.remove));

export default cloudinaryRoutes;
