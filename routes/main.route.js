import express from 'express'
import userRoute from './user.route.js';
import productRoute from './product.route.js';

const mainRoute = express.Router();

mainRoute.use("/auth", userRoute);

mainRoute.use("/product", productRoute);

export default mainRoute;