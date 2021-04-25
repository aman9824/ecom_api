import express from 'express';
import AsyncHandler from 'express-async-handler';

import UserController from '../controllers/userController';
import auth from '../middleware/auth';

const userRoutes = express.Router();

userRoutes.get('/user_info', auth, AsyncHandler(UserController.getUserInfo));
userRoutes.post('/password/forgot', AsyncHandler(UserController.forgotPassword));
userRoutes.post('/password/reset', auth, AsyncHandler(UserController.resetPassword));
userRoutes.put('/update', auth, AsyncHandler(UserController.updateUser));
userRoutes.delete('/delete', auth, AsyncHandler(UserController.deleteUser));

// cart
userRoutes.post('/cart', auth, AsyncHandler(UserController.userCart)); // save cart
userRoutes.get('/cart', auth, AsyncHandler(UserController.getUserCart)); // get cart
userRoutes.delete('/cart', auth, AsyncHandler(UserController.emptyCart)); // empty cart

// address
userRoutes.post('/address', auth, AsyncHandler(UserController.saveAddress)); // save address

// coupon
userRoutes.post('/cart/coupon', auth, AsyncHandler(UserController.applyCouponToUserCart));

// wishlist
userRoutes.post('/wishlist', auth, AsyncHandler(UserController.addToWishlist));
userRoutes.get('/wishlist', auth, AsyncHandler(UserController.wishlist));
userRoutes.put('/wishlist/:productId', auth, AsyncHandler(UserController.removeFromWishlist));

export default userRoutes;
