import { appError } from '../utlis/appError.js';
import mongoose from 'mongoose';
import asyncWrapper from '../utlis/asyncWrapper.js';
import { httpStatusText } from '../utlis/httpStatusText.js';
import { ordersSchema } from '../modules/order.js';
import { productsSchema } from '../modules/products.js';
import { orderItemsSchema } from '../modules/cart.js';
export const ordersController = {
 getAllOrders: asyncWrapper(async (req, res, next) => {
  const orders = await ordersSchema
   .find()
   .populate({ path: 'orderItems', populate: { path: 'product' } })
   .sort('-1');
  if (orders.length === 0) {
   const error = new appError(404, httpStatusText.FAILED, "there isn't any  orders");
   return next(error);
  }

  res.status(200).send({ statusCode: 200, statusText: httpStatusText.SUCCESS, data: orders });
 }),
 addOrder: asyncWrapper(async (req, res, next) => {
  const orderItems = req.body.orderItems;
  for (const item of orderItems) {
   const product = await productsSchema.findById(item.product);
   if (!product) {
    const error = new appError(404, httpStatusText.FAILED, "this product doesn't exist");
    return next(error);
   }
   if (item.quantity > product.quantity) {
    const error = new appError(404, httpStatusText.FAILED, 'this product is out of stock');
    return next(error);
   }
  }
  const orderItemsIds = await Promise.all(
   req.body.orderItems.map(async (item) => {
    const orderItem = new orderItemsSchema({
     product: item.product,
     quantity: item.quantity,
    });
    await orderItem.save();
    return orderItem._id;
   })
  );
  const totalPrices = await Promise.all(
   req.body.orderItems.map(async (item) => {
    const product = await productsSchema.findById(item.product);
    return product.price * item.quantity;
   })
  );
  const totalPrice = totalPrices.reduce((a, b) => {
   return a + b;
  });
  const order = new ordersSchema({
   user: req.body.user,
   orderItems: orderItemsIds,
   phoneNumber: +req.body.phoneNumber,
   address1: req.body.address1,
   address2: req.body.address2,
   zip: +req.body.zip,
   totalPrice: totalPrice,
  });
  await order.save();
  res.status(201).send({ statusCode: 201, statusText: httpStatusText.SUCCESS, data: order });
 }),
 updateOrder: asyncWrapper(async (req, res, next) => {
  const updatedOrder = await ordersSchema.findOneAndUpdate(
   {
    _id: req.params.id,
   },
   {
    status: req.body.status,
   },
   {
    new: true,
   }
  );
  if (!updatedOrder) {
   const error = new appError(404, httpStatusText.FAILED, "this order doesn't exist");
   return next(error);
  }
  res.status(200).send({ statusCode: 200, statusText: httpStatusText.SUCCESS, data: updatedOrder });
 }),
 deleteOrder: asyncWrapper(async (req, res, next) => {
  const order = await ordersSchema.findOne({ _id: req.params.id });
  if (!order) {
   const error = new appError(404, httpStatusText.FAILED, 'this order doesnt exist');
   return next(error);
  }
  await ordersSchema.findOneAndDelete({ _id: order._id });
  res.status(200).send({ statusCode: 200, statusText: httpStatusText.SUCCESS, data: null });
 }),
 ordersCount: asyncWrapper(async (req, res, next) => {
  // for counting orders with specific status
  const ordersCount = await ordersSchema.countDocuments({ status: req.query.status });
  if (ordersCount === 0) {
   const error = new appError(404, httpStatusText.FAILED, 'No orders');
   return next(error);
  }
  res.status(200).send({ statusCode: 200, statusText: httpStatusText.SUCCESS, data: ordersCount });
 }),
 ordersHistory: asyncWrapper(async (req, res, next) => {
  const orders = await ordersSchema.findOne({ user: req.params.id }).populate({ path: 'orderItems', populate: { path: 'product' } });
  if (!orders) {
   const error = new appError(404, httpStatusText.FAILED, 'no previous orders');
   return next(error);
  }
  res.status(200).send({ statusCode: 200, statusText: httpStatusText.SUCCESS, data: orders });
 }),
};
