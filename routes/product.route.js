import express from 'express'
import { adminRoute, protectedRoute } from '../middlewares/protectedRoute.js';
import { addProduct, deleteProduct, editProduct, getAllProducts } from '../controllers/product/product.controller.js';
import upload from '../config/multerConfig.js'

const productRoute = express.Router();

productRoute.get("/", protectedRoute, adminRoute, getAllProducts);

productRoute.post("/add-product", protectedRoute, adminRoute, upload.single('image'), addProduct);

productRoute.delete("/delete-product/:id", protectedRoute, adminRoute, deleteProduct);

productRoute.patch("/edit-product/:id", protectedRoute, adminRoute, upload.single('image'), editProduct);

export default productRoute;