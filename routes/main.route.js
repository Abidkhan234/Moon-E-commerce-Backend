import express from 'express'
import userRoute from './user.route.js';
import productRoute from './product.route.js';
import orderRoute from './order.route.js';

const mainRoute = express.Router();

mainRoute.use("/auth", userRoute);

mainRoute.use("/product", productRoute);

mainRoute.use("/order", orderRoute);

export default mainRoute;