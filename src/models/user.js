import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: true,
    maxlength: 100
  },
  lastName: {
    type: String,
    trim: true,
    required: true,
    maxlength: 100
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: 32
  },
  password: {
    type: String,
    required: true
  },
  picture: {
    type: String
  },
  role: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  cart: {
    type: Array,
    default: []
  },
  address: String,
  wishlist: [{ type: ObjectId, ref: 'Product' }]
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
