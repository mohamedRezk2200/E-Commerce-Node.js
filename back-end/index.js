import express from 'express';
import dotenv from 'dotenv';
import { db } from './utlis/db.js';
import { usersRoutes } from './routes/usersRoutes.js';
import { appError } from './utlis/appError.js';
import { categoriesRoutes } from './routes/cateogriesRoutes.js';
import { errorHandler } from './utlis/errorHandler.js';
import { productsRoutes } from './routes/productsRoutes.js';
import { ordersRoutes } from './routes/ordersRoutes.js';
import { __dirname } from './utlis/multerConfig.js';
import helmet from 'helmet';
import path from 'path';
const app = express();
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
dotenv.config({ path: './.env' });
await db();
app.use(helmet());
app.use(express.json());
app.use(`${process.env.API_URL}/users`, usersRoutes);
app.use(`${process.env.API_URL}/categories`, categoriesRoutes);
app.use(`${process.env.API_URL}/products`, productsRoutes);
app.use(`${process.env.API_URL}/orders`, ordersRoutes);

app.all('*', (req, res, next) => {
 const error = new appError(404, 'error', 'this page is not found');
 next(error);
});
app.use(errorHandler);
app.listen(process.env.PORT, () => {
 console.log('listening on port 4000');
});
