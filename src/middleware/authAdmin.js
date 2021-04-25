import User from '../models/user';

const authAdmin = async (req, res, next) => {
  try {
    // Get user information by id
    const user = await User.findOne({
      _id: req.user.id
    });
    if (user.role !== 2) return res.status(403).send({ msg: 'Admin access denied' });
    return next();
  } catch (error) {
    return next(new Error(error));
  }
};

export default authAdmin;
