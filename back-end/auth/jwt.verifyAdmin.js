import jwt from 'jsonwebtoken';
import { appError } from '../utlis/appError.js';
import { httpStatusText } from '../utlis/httpStatusText.js';
import { usersSchema } from '../modules/usersSchema.js';
export const verifyAdmin = async (req, res, next) => {
    try {
 const token = req.headers['authorization'].split(' ')[1] || req.headers['Authorization'].split(' ')[1];
 if (!token) {
  const error = new appError(400, httpStatusText.FAILED, ' token is needed');
  return next(error);
 }
  jwt.verify(token, process.env.SECRET_KEY);
  const user = await usersSchema.findById(jwt.decode(token)._id);
  req.token = token;
  if (user.isAdmin) {
   return next();
  } else {
   const error = new appError(401, httpStatusText.FAILED, 'unauthorized access');
   return next(error);
  }
 } catch (err) {
  const error = new appError(401, httpStatusText.FAILED, 'invalid token');
  next(error);
 }
};
