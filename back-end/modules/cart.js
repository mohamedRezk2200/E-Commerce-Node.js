import mongoose from 'mongoose';
const orderItem = mongoose.Schema({
 product: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'products',
  required: [true, 'product id is required'],
 },
 quantity: {
  type: Number,
  required: [true, 'quantity is required'],
 },
});
export const orderItemsSchema = mongoose.model('OrderItem', orderItem);
