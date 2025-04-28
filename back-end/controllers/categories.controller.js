import { categoriesSchema } from '../modules/catgeories.js';
import asyncWrapper from '../utlis/asyncWrapper.js';
import { appError } from '../utlis/appError.js';
import { httpStatusText } from '../utlis/httpStatusText.js';
export const categoriesController = {
 getAllCategories: asyncWrapper(async (req, res, next) => {
  const categories = await categoriesSchema.find().select('-__v');
  if (categories.length === 0) {
   const error = new appError(404, httpStatusText.FAILED, "there isn't any categories");
   return next(error);
  }

  res.status(200).send({ statusCode: 200, statusText: httpStatusText.SUCCESS, data: categories });
 }),
 addCategory: asyncWrapper(async (req, res) => {
  const category = new categoriesSchema({
   name: req.body.name,
   color: req.body.color,
   icon: req.body.icon,
   image: req.body.image,
  });
  await category.save();
  res.status(201).send({ statusCode: 201, statusText: httpStatusText.SUCCESS, data: category });
 }),
 getCategory: asyncWrapper(async (req, res, next) => {
  const id = req.params.id;
  const category = await categoriesSchema.findById(id);
  if (!category) {
   const error = new appError(404, httpStatusText.FAILED, "this category doesn't exist");
   return next(error);
  }

  res.status(200).res.send({ statusCode: 200, statusText: httpStatusText.SUCCESS, data: category });
 }),
 updateCategory: asyncWrapper(async (req, res, next) => {
  const updatedCategory = await categoriesSchema.findOneAndUpdate(
   { _id: req.params.id },
   {
    name: req.body.name,
    color: req.body.color,
    icon: req.body.icon,
    image: req.body.image,
   },
   { new: true }
  );
  if (!updatedCategory) {
   const error = new appError(404, httpStatusText.FAILED, 'this category doesnt exist');
   return next(error);
  }
  res.status(200).send({ statusCode: 200, statusText: httpStatusText.SUCCESS, data: updatedCategory });
 }),
 deleteCategory: asyncWrapper(async (req, res, next) => {
  const category = await categoriesSchema.findOne({ _id: req.params.id });
  if (!category) {
   const error = new appError(404, httpStatusText.FAILED, 'this category doesnt exist');
   return next(error);
  }
  await categoriesSchema.findOneAndDelete({ _id: category._id });
  res.status(200).send({ statusCode: 200, statusText: httpStatusText.SUCCESS, data: null });
 }),
};
