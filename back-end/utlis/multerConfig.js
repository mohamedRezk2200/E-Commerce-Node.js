import multer from 'multer';
import { appError } from './appError.js';
import { httpStatusText } from './httpStatusText.js';
import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
const app = express();
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
const diskStorage = multer.diskStorage({
 destination: function (req, file, cb) {
  const imagesFormats = ['jpg', 'JPG', 'png', 'PNG', 'jpeg', 'JPEG'];
  if (!imagesFormats.includes(file.mimetype.split('/')[1])) {
   return cb(new appError(400, httpStatusText.ERROR, 'bad image format'), null);
  }
  return cb(null, path.join(__dirname, '..', 'uploads', 'products'));
 },
 filename: function (req, file, cb) {
  const fileName = `${file.originalname}${Date.now()}.${file.mimetype.split('/')[1]}`;
  cb(null, fileName);
 },
});
const fileFilter = (req, file, cb) => {
 const imagesFormats = ['jpg', 'JPG', 'png', 'PNG', 'jpeg', 'JPEG'];
 if (!imagesFormats.includes(file.mimetype.split('/')[1])) {
  return cb(new appError(400, httpStatusText.ERROR, 'bad image format'), null);
 }
 cb(null, true);
};
export const upload = multer({ storage: diskStorage,fileFilter});
