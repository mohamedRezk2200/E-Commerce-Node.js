import mongoose from 'mongoose';
export const db= async function () {
 let connected = false;
 while(!connected){
 try {
   console.log('connecting to the db');
   await mongoose.connect(process.env.MONGO_URL);
   connected = true;
   console.log('db is online');

 } catch (err) {
  console.log('failed to connect to the DB');
  console.log('retrying in 5 sec');
 await new Promise((resolve)=>setTimeout(resolve,5000))
 
}}}
