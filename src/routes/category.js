import express from 'express';
import AsyncHandler from 'express-async-handler';

import CategoryController from '../controllers/categoryController';
import auth from '../middleware/auth';
import authAdmin from '../middleware/authAdmin';


const categoryRoutes = express.Router();

categoryRoutes.get('/categories', AsyncHandler(CategoryController.listCategories));
categoryRoutes.post('/category/create', auth, authAdmin, AsyncHandler(CategoryController.createCategory));
categoryRoutes.put('/category/update/:id', auth, authAdmin, AsyncHandler(CategoryController.updateCategory));
categoryRoutes.delete('/category/delete/:id', auth, authAdmin, AsyncHandler(CategoryController.deleteCategory));
categoryRoutes.get('/category/:id', AsyncHandler(CategoryController.getOneCategory));
categoryRoutes.get('/category/subs/:id', AsyncHandler(CategoryController.getCategorySubs));

export default categoryRoutes;
