import express from 'express'
import { protectedRoute } from '../middlewares/protectedRoute.js';
import { addOrder, getOrders } from '../controllers/order/order.controller.js';


const orderRoute = express.Router();

orderRoute.post("/add-order", protectedRoute, addOrder)

orderRoute.get("/get-orders", protectedRoute, getOrders)

export default orderRoute;