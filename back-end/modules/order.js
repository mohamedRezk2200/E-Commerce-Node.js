import mongoose from 'mongoose';
const orderSchema = mongoose.Schema(
 {
  orderItems: [
   {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'cart',
    required: [true, 'cart items are required'],
   },
  ],
  user: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'user',
   required: [true, 'user id is required'],
  },
  phoneNumber: {
   type: Number,
   required: [true, 'phone number is required'],
  },
  address1: {
   type: String,
   required: [true, 'address is required'],
  },
  address2: {
   type: String,
  },
  zip: {
   type: Number,
   required: [true, 'zip is required'],
  },
  status: {
   type: String,
   enum: {
    values: ['pending', 'shipped', 'delivered', 'cancelled'],
    message: "please enter a valid status like {'pending', 'shipped', 'delivered', 'cancelled'}",
   },
   default: 'pending',
   required: [true, 'user id is required'],
  },
  totalPrice: {
   type: Number,
   required: [true, 'total price is required']
  },
 },
 { timestamps: true }
);
export const ordersSchema = mongoose.model('Order', orderSchema);
