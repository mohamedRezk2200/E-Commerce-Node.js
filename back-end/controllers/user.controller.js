import { usersSchema } from '../modules/usersSchema.js';
import asyncWrapper from '../utlis/asyncWrapper.js';
import { appError } from '../utlis/appError.js';
import bcrypt from 'bcryptjs';
import { createToken } from '../auth/jwt.token.sign.js';
import { httpStatusText } from '../utlis/httpStatusText.js';
import jwt from 'jsonwebtoken';
import { validateEmail } from '../utlis/emailvalidator.js';
export const userControllers = {
 getAllUsers: asyncWrapper(async (req, res, next) => {
  const users = await usersSchema.find({}, { password: false });
  if (users.length === 0) {
   const error = new appError(404, httpStatusText.FAILED, 'no users available');
   return next(error);
  }

  res.status(200).send({ statusCode: 200, statusText: httpStatusText.SUCCESS, data: users });
 }),
 register: asyncWrapper(async (req, res, next) => {
  const { Email } = req.body;
  if (!Email || !validateEmail(Email)) {
   const error = new appError(400, httpStatusText.FAILED, 'Invalid email format');
   return next(error);
  }
  const hashedPassword = await bcrypt.hash(`${req.body.password}`, 10);
  const user = new usersSchema({
   name: req.body.name,
   hashedPassword: hashedPassword,
   password: +req.body.password,
   age: req.body.age,
   Email: req.body.Email,
   phoneNumber: req.body.phoneNumber,
   address1: req.body.address1,
   address2: req.body.address2,
   zip: req.body.zip,
  });
  await user.save();
  return res.status(201), res.send({ statusCode: 201, statusText: httpStatusText.SUCCESS, data: user });
 }),
 login: asyncWrapper(async (req, res, next) => {
  const user = await usersSchema.findOne({ Email: req.body.Email });
  if (!user) {
   const error = new appError(404, httpStatusText.FAILED, "this user doesn't exist");
   return next(error);
  }
  const password = req.body.password;
  if (!(await bcrypt.compare(`${password}`, user.hashedPassword))) {
   return res.status(400).send('the email or password maybe wrong');
  }

  const token = createToken({ _id: user._id });
  user.token = token;
  await user.save();
  req.token = token;
  res.status(200).send({ statusCode: 200, statusText: httpStatusText.SUCCESS, data: user });
 }),
 getUser: asyncWrapper(async (req, res, next) => {
  const id = req.params.id;
  const user = await usersSchema.findById(id);
  if (!user) {
   const error = new appError(404, httpStatusText.FAILED, "this user doesn't exist");
   return next(error);
  }

  res.status(200), res.send({ statusCode: 200, statusText: httpStatusText.SUCCESS, data: user });
 }),
 updateUser: asyncWrapper(async (req, res, next) => {
  const updatedUser = await usersSchema.findOneAndUpdate(
   { _id: req.params.id },
   {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
   },
   { new: true }
  );
  if (!updatedUser) {
   const error = new appError(404, httpStatusText.FAILED, 'this user doesnt exist');
   return next(error);
  }

  res.status(200).send({ statusCode: 200, statusText: httpStatusText.SUCCESS, data: updatedUser });
 }),
 deleteUser: asyncWrapper(async (req, res, next) => {
  const user = await usersSchema.findOne({ _id: req.params.id });
  if (!user) {
   const error = new appError(404, httpStatusText.FAILED, 'this user doesnt exist');
   return next(error);
  }
  await usersSchema.findOneAndDelete({ _id: user._id });
  res.status(200).send({ statusCode: 200, statusText: httpStatusText.SUCCESS, data: null });
 }),
 logout: asyncWrapper(async (req, res, next) => {
  const user = await usersSchema.findOne({ _id: jwt.decode(req.token)._id });
  user.token = '';
  user.save();
  res.status(200).send({ statusCode: 200, statusText: httpStatusText.SUCCESS, data: 'logedout' });
 }),
};
