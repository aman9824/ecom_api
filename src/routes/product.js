import express from 'express';
import AsyncHandler from 'express-async-handler';

import ProductController from '../controllers/productController';
import auth from '../middleware/auth';
import authSeller from '../middleware/authSeller';

const productRoutes = express.Router();

productRoutes.get('/products/:count', AsyncHandler(ProductController.getProductsByCount));
productRoutes.get('/products/total', AsyncHandler(ProductController.getProductsTotal));
productRoutes.post('/products/', AsyncHandler(ProductController.getProductList));
productRoutes.get('/product/:productId', AsyncHandler(ProductController.getProductById));
productRoutes.post('/product/create', auth, authSeller, AsyncHandler(ProductController.createProduct));
productRoutes.delete('/product/:productId', auth, authSeller, AsyncHandler(ProductController.deleteProduct));
productRoutes.put('/product/:productId', auth, authSeller, AsyncHandler(ProductController.updateProduct));
productRoutes.put('/product/star/:productId', auth, AsyncHandler(ProductController.productStar));
productRoutes.get('/product/related/:productId', AsyncHandler(ProductController.listRelatedProducts));
productRoutes.post('/products/search/filters', AsyncHandler(ProductController.searchProducts));


export default productRoutes;
