import { appError } from '../utlis/appError.js';
import asyncWrapper from '../utlis/asyncWrapper.js';
import { httpStatusText } from '../utlis/httpStatusText.js';
import { productsSchema } from '../modules/products.js';
import { upload } from '../utlis/multerConfig.js';
export const productsController = {
 getAllProducts: asyncWrapper(async (req, res, next) => {
  const products = await productsSchema.find().populate('category', 'name');
  if (products.length === 0) {
   const error = new appError(404, httpStatusText.FAILED, "there isn't any  products");
   return next(error);
  }

  res.status(200).send({ statusCode: 200, statusText: httpStatusText.SUCCESS, data: products });
 }),
 addProduct: asyncWrapper(async (req, res) => {
  if (!req.file) {
   const error = new appError(400, httpStatusText.FAILED, 'please upload an image');
  }

  const product = new productsSchema({
   name: req.body.name,
   quantity: +req.body.quantity,
   oldPrice: +req.body.oldPrice,
   price: +req.body.price,
   image: `${req.protocol}:${req.headers.host}/uploads/products/` + req.file.filename,
   images: req.body.images,
   discription: req.body.discription,
   richDiscription: req.body.richDiscription,
   category: req.body.category,
   available: req.body.quantity > 0,
  });

  await product.save();
  res.status(201).send({ statusCode: 201, statusText: httpStatusText.SUCCESS, data: product });
 }),
 getProduct: asyncWrapper(async (req, res, next) => {
  const id = req.params.id;
  const product = await productsSchema.findById(id).populate('category');
  if (!product) {
   const error = new appError(404, httpStatusText.FAILED, "this product doesn't exist");
   return next(error);
  }

  res.status(200).send({ statusCode: 200, statusText: httpStatusText.SUCCESS, data: product });
 }),
 updateProduct: asyncWrapper(async (req, res, next) => {
  const updatedProduct = await productsSchema.findOneAndUpdate(
   { _id: req.params.id },
   {
    name: req.body.name,
    quantity: +req.body.quantity,
    oldPrice: +req.body.oldPrice,
    price: +req.body.price,
    image: req.body.image,
    images: req.body.images,
    discription: req.body.discription,
    richDiscription: req.body.richDiscription,
    available: req.body.available,
    category: req.body.category,
   },
   { new: true }
  );
  if (!updatedProduct) {
   const error = new appError(404, httpStatusText.FAILED, 'this product doesnt exist');
   return next(error);
  }
  res.status(200).send({ statusCode: 200, statusText: httpStatusText.SUCCESS, data: updatedProduct });
 }),
 uploadProductGallety: asyncWrapper(async (req, res, next) => {
  let imagesPaths = [];
  const files = req.files;
  files.map((file) => {
   imagesPaths.push(`${req.protocol}:${req.headers.host}/uploads/products/` + req.files.filename);
   return imagesPaths;
  });

  const updatedProduct = await productsSchema.findOneAndUpdate(
   { _id: req.params.id },
   {
    images: imagesPaths,
   },
   { new: true }
  );
  if (!updatedProduct) {
   const error = new appError(404, httpStatusText.FAILED, 'this product doesnt exist');
   return next(error);
  }
  res.status(200).send({ statusCode: 200, statusText: httpStatusText.SUCCESS, data: updatedProduct });
 }),
 deleteProduct: asyncWrapper(async (req, res, next) => {
  const product = await productsSchema.findOne({ _id: req.params.id });
  if (!product) {
   const error = new appError(404, httpStatusText.FAILED, 'this product doesnt exist');
   return next(error);
  }
  await productsSchema.findOneAndDelete({ _id: product._id });
  res.status(200).send({ statusCode: 200, statusText: httpStatusText.SUCCESS, data: null });
 }),
};
