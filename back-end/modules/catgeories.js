import mongoose from 'mongoose';
const catgeorieSchema = mongoose.Schema({
 name: {
  type: String,
  required: [true, 'name is required'],
 },
 color: {
  type: String,
 },
 icon: {
  type: String,
  required: [true, 'icon is required'],
 },
 image: {
  type: String,
  required: [true, 'image is required'],
 },
});
export const categoriesSchema = mongoose.model('Catgeories', catgeorieSchema);
