import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      text: true
    },
    seller: {
      name: {
        type: String,
        trim: true,
        required: true
      },
      id: {
        type: ObjectId,
        ref: 'User'
      }
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
      text: true
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 32
    },
    category: {
      type: ObjectId,
      ref: 'Category'
    },
    subs: [
      {
        type: ObjectId,
        ref: 'Sub'
      }
    ],
    quantity: Number,
    sold: {
      type: Number,
      default: 0
    },
    images: {
      type: Array
    },
    shipping: {
      type: String,
      enum: ['Yes', 'No']
    },
    ratings: [
      {
        star: Number,
        postedBy: { type: ObjectId, ref: 'User' }
      }
    ]
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
