/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import _ from 'lodash';

import User from '../models/user';
import { createAccessToken, createActivationToken, createRefreshToken } from '../helpers';
import sendActivationEmail from '../helpers/sendMail';
import googleMail from '../helpers/googleMail';


const AuthController = {
  async register(req, res) {
    const {
      firstName, lastName, email, password
    } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).send({ error: { message: 'email already exists' } });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      firstName, lastName, email, password: passwordHash
    };
    await new User(newUser).save();
    const CLIENT_URL = 'http://localhost:3000';
    const activationToken = createActivationToken(newUser);
    const url = `${CLIENT_URL}/api/auth/activate/${activationToken}`;
    // sendActivationEmail(newUser, url, 'verify email address');
    googleMail(newUser, url, 'verify email address');
    return res.json({ msg: 'Please check your email for activation' });
  },

  async signin(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ msg: 'User does not exist.' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send({ msg: 'Incorrect password.' });
    if (user.isVerified === false) {
      return res.status(400).send({
        msg: 'Account not activated',
        user: _.pick(user, ['email', 'isVerified'])
      });
    }

    // If login success , create access token and refresh token
    const accessToken = createAccessToken({ id: user._id });
    const refreshtoken = createRefreshToken({ id: user._id });

    res.cookie('refreshtoken', refreshtoken, {
      httpOnly: true,
      path: '/api/auth/refresh_token',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
    });
    return res.status(200).send({ accessToken });
  },

  async signout(req, res) {
    res.clearCookie('refreshtoken', { path: '/api/auth/refresh_token' });
    return res.send({ msg: 'Logged out' });
  },

  async getUserInfo(req, res) {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(400).send({ msg: 'User does not exist.' });
    return res.status(200).send(user);
  },

  getAccessToken: (req, res, next) => {
    const rf_token = req.cookies.refreshtoken;
    if (!rf_token) return res.status(400).json({ msg: 'Please login now!' });

    jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return next(createError(400, 'Please login now!'));

      const access_token = createAccessToken({ id: user.id });
      return res.json({ access_token });
    });
  },

  async activateEmail(req, res) {
    const { activationToken } = req.body;
    const user = jwt.verify(activationToken, process.env.ACTIVATION_TOKEN_SECRET);
    user.isVerified = true;
    const newUser = new User(user);
    await newUser.save();
    return res.json({ msg: 'Account has been activated!' });
  }
};

export default AuthController;
