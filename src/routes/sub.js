import express from 'express';
import AsyncHandler from 'express-async-handler';

import subCategoryController from '../controllers/subCategoryController';
import auth from '../middleware/auth';
import authAdmin from '../middleware/authAdmin';


const subCategoryRoutes = express.Router();

subCategoryRoutes.get('/subs', AsyncHandler(subCategoryController.listSubs));
subCategoryRoutes.post('/sub/create', auth, authAdmin, AsyncHandler(subCategoryController.createSub));
subCategoryRoutes.get('/sub/:id', AsyncHandler(subCategoryController.getOneSubCategory));
subCategoryRoutes.put('/sub/update/:id', auth, authAdmin, AsyncHandler(subCategoryController.updateSubCategory));
subCategoryRoutes.delete('/sub/delete/:id', auth, authAdmin, AsyncHandler(subCategoryController.deleteSubCategory));

export default subCategoryRoutes;
