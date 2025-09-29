import express from 'express'
import { getProduct } from '../controllers/product/product.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const productRoute = express.Router();

productRoute.get("/fetch-products", authMiddleware, getProduct)

export default productRoute;