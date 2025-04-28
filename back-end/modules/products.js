import mongoose from 'mongoose';
const productSchema = mongoose.Schema(
 {
  name: {
   type: String,
   required: [true, 'name of the product is required'],
  },
  quantity: {
   type: Number,
   default: 1,
  },
  oldPrice: {
   type: Number,
  },
  price: {
   type: Number,
   required: [true, 'price of the product is required'],
  },
  image: {
   type: String,
   required: [true, 'image of the product is required'],
  },
  images: [
   {
    type: String,
   },
  ],
  discription: {
   type: String,
   required: [true, 'discription of the product is required'],
  },
  richDiscription: {
   type: String,
   required: [true, ' rich discription of the product is required'],
  },
  available: {
   type: Boolean,
   deafult: true,
  },

  category: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'Catgeories',
   required: true, 
  },
 },
 { timestamps: true }
);

export const productsSchema = mongoose.model('products', productSchema);
