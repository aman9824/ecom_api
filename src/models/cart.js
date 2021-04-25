import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema;

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: ObjectId,
        ref: 'Product'
      },
      count: Number,
      price: Number
    }
  ],
  cartTotal: Number,
  totalAfterDiscount: Number,
  orderdBy: { type: ObjectId, ref: 'User' }
},
{ timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
