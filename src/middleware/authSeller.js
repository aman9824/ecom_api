import User from '../models/user';

const authSeller = async (req, res, next) => {
  try {
    // Get user information by id
    const user = await User.findOne({
      _id: req.user.id
    });
    if (user.role === 0) return res.status(403).send({ msg: 'Seller access denied' });
    return next();
  } catch (error) {
    return next(new Error(error));
  }
};

export default authSeller;
