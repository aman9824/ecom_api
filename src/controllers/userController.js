/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line no-plusplus
import bcrypt from 'bcryptjs';
import createError from 'http-errors';

import { createAccessToken } from '../helpers';
import sendActivationEmail from '../helpers/sendMail';
import Cart from '../models/cart';
import Coupon from '../models/coupon';
import Product from '../models/product';
import User from '../models/user';

const UserController = {
  async getUserInfo(req, res) {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(400).send({ msg: 'User does not exist.' });
    return res.status(200).send(user);
  },

  forgotPassword: async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'This email does not exist.' });

    const accessToken = createAccessToken({ id: user._id });
    const CLIENT_URL = 'http://localhost:3000';
    const url = `${CLIENT_URL}/api/user/password/reset/${accessToken}`;
    sendActivationEmail(user, url, 'Reset your password');
    return res.json({ msg: 'Re-send the password, please check your email.' });
  },

  resetPassword: async (req, res) => {
    const { password } = req.body;
    const passwordHash = await bcrypt.hash(password, 12);

    await User.findOneAndUpdate({ _id: req.user.id }, {
      password: passwordHash
    });

    return res.json({ msg: 'Password successfully changed!' });
  },

  async updateUser(req, res) {
    await User.findByIdAndUpdate(req.user.id, req.body);
    return res.json({ msg: 'Update Success!' });
  },

  async deleteUser(req, res) {
    await User.findByIdAndRemove(req.user.id);
    return res.json({ msg: 'User deleted!' });
  },

  // cart

  async userCart(req, res) {
    // console.log(req.body); // {cart: []}
    const { cart } = req.body;

    const products = [];

    // check if cart with logged in user id already exist
    const cartExistByThisUser = await Cart.findOne({ orderdBy: req.user.id }).exec();

    if (cartExistByThisUser) {
      cartExistByThisUser.remove();
    }

    for (let i = 0; i < cart.length; i++) {
      const object = {};

      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      // get price for creating total

      // eslint-disable-next-line no-await-in-loop
      const productFromDb = await Product.findById(cart[i]._id)
        .select('price');

      object.price = productFromDb.price;

      products.push(object);
    }

    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal += products[i].price * products[i].count;
    }

    const newCart = await new Cart({
      products,
      cartTotal,
      orderdBy: req.user.id
    }).save();

    return res.json(newCart);
  },

  async getUserCart(req, res) {
    const cart = await Cart.findOne({ orderdBy: req.user.id })
      .populate('products.product', '_id title price totalAfterDiscount');

    const { products, cartTotal, totalAfterDiscount } = cart;
    return res.json({ products, cartTotal, totalAfterDiscount });
  },

  async emptyCart(req, res) {
    const cart = await Cart.findOneAndRemove({ orderdBy: req.user.id }).exec();
    return res.json(cart);
  },

  async saveAddress(req, res) {
    const userAddress = await User.findOneAndUpdate(
      { _id: req.user.id },
      { address: req.body.address }
    );
    return res.json(userAddress);
  },

  async applyCouponToUserCart(req, res, next) {
    const { coupon } = req.body;

    const validCoupon = await Coupon.findOne({ name: coupon }).exec();
    if (validCoupon === null) {
      return next(createError(400, 'Invalid Coupon'));
    }

    const { cartTotal } = await Cart.findOne({ orderdBy: req.user.id })
      .populate('products.product', '_id title price');

    // calculate the total after discount
    const totalAfterDiscount = (
      cartTotal
    - (cartTotal * validCoupon.discount) / 100
    ).toFixed(2); // 99.99

    Cart.findOneAndUpdate(
      { orderdBy: req.user.id },
      { totalAfterDiscount },
      { new: true }
    );

    return res.json(totalAfterDiscount);
  },

  async addToWishlist(req, res) {
    const { productId } = req.body;
    await User.findOneAndUpdate(
      { _id: req.user.id },
      { $addToSet: { wishlist: productId } }
    );

    return res.json({ ok: true });
  },

  async wishlist(req, res) {
    const list = await User.findById(req.user.id)
      .select('wishlist')
      .populate('wishlist');
    return res.json(list);
  },

  async removeFromWishlist(req, res) {
    const { productId } = req.params;
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { wishlist: productId } }
    );
    return res.json({ ok: true });
  }

};
export default UserController;
