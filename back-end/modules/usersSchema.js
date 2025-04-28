import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
 name: {
  type: String,
  required: true,
 },
 hashedPassword: {
  type: String,
  required: [true, 'hashed password is required'],
 },
 token: String,
 password: {
  type: Number,
  required: [true, 'password is required'],
 },
 age: {
  type: Number,
  required: [true, 'age is required'],
 },
 Email: {
  type: String,
  unique: [true, 'email already exists'],
  required: [true, 'email is required'],
 },
 phoneNumber: {
  type: Number,
  required:[ true, 'phone number is required']
 },
 address1: {
  type: String,
  required:[ true, 'address is required']
 },
 address2: {
  type: String,
  default: '',
 },
 zip: { type: Number, default: '' },
 isAdmin: {
  type: Boolean,
  default: false,
  immutable: true, // for security reasons you can't change this through code only you can give admin authorities through db
 },
});
export const usersSchema = mongoose.model('User', userSchema);
