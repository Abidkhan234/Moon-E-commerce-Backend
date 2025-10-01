import Product from "../../models/productModel.js";
import User from "../../models/userModel.js";
import { imageDestroyer, imageUploader } from '../../utils/cloudinary.js'

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});

        res.status(200).json({ status: 200, products: [...products] })
    } catch (error) {
        console.log("Products Error", error);
        res.status(500).send({ status: 500, message: "Server Error", error: error.message })
    }
}

const addProduct = async (req, res) => {
    try {

        const { _id } = req.user;

        const filePath = await imageUploader(req.file?.path);

        if (!filePath) {
            return res.status(400).send({ status: 400, message: "File is required" });
        }

        const user = await User.findById(_id);

        if (!user) {
            return res.status(404).send({ status: 404, message: "User not found" })
        }

        await Product.create({
            image: {
                url: filePath.url,
                public_id: filePath.public_id
            },
            adminId: _id,
            ...req.body
        })

        return res.status(200).send({ status: 200, message: "Product upload successfully" })
    } catch (error) {
        console.log("Add Product Error", error.message);
        res.status(500).send({ status: 500, message: "Internal Server Error", error: error.message })
    }
}

const deleteProduct = async (req, res) => {
    try {

        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ status: 400, message: "No product ID provided" });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).send({ status: 404, message: "Product not found" });
        }

        await imageDestroyer(product.image.public_id);

        await Product.findByIdAndDelete(id);

        res.status(200).send({ status: 200, message: "Product deleted successfully" });
    } catch (error) {
        console.log("Delete Product Error", error.message);
        res.status(500).send({ status: 500, message: "Internal Server Error", error: error.message })
    }
}

const editProduct = async (req, res) => {
    try {

        const id = req.params.id;

        if (!id) {
            return res.status(400).send({ status: 400, message: "No product ID provided" });
        }

        const localFilePath = req.file?.path;

        const updatedContent = req.body;

        let public_id;

        let imageUrl;

        if (localFilePath) {

            const product = await Product.findById(id);

            if (!product) {
                return res.status(404).send({ status: 404, message: "Product not found" });
            }

            await imageDestroyer(product.image.public_id);

            const filePath = await imageUploader(localFilePath);

            imageUrl = filePath.url;
            public_id = filePath.public_id
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                $set: { ...updatedContent, image: { url: imageUrl, public_id } }
            },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).send({ status: 404, message: "Product not found" });
        }

        res.status(200).send({ status: 200, message: "Product Updated successfully" })
    } catch (error) {
        console.log("Edit Product Error", error.message);
        res.status(500).send({ status: 500, message: "Internal server error", error: error.message })
    }
}

export { getAllProducts, addProduct, deleteProduct, editProduct }