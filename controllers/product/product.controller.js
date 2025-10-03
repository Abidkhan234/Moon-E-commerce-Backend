import Product from "../../models/productModel.js";
import User from "../../models/userModel.js";
import { imageDestroyer, imageUploader } from '../../utils/cloudinary.js'

const getAllProducts = async (req, res) => {
    const { sortBy, page = 1, limit = 5, ...filters } = req.query;

    if (page < 0) {
        try {
            const products = await Product.find(filters);

            if (!products) {
                return res.status(404).send({ status: 404, message: "Product not found" })
            }

            const totalRecord = await Product.countDocuments(filters);

            return res.status(200).json({
                status: 200,
                products,
                totalRecord
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 500, message: "Internal server error", error: error.message })
        }
    }

    // For Pagination
    const skip = (Number(page) - 1) * Number(limit);
    // For Pagination

    // For Sorting: Like latest,high to low and low to high
    let sortCondition = {};
    // For Sorting: Like latest,high to low and low to high

    if (typeof sortBy == "string") {
        const sort = sortBy.toLowerCase();

        if (sort.includes("latest")) {
            sortCondition = { createdAt: -1 }; // newest first
        } else if (sort.includes("low")) {
            sortCondition = { discountedPrice: 1 }; // ascending
        } else if (sort.includes("high")) {
            sortCondition = { discountedPrice: -1 }; // descending
        }
    }

    try {

        const products = await Product.find(filters)
            .sort(sortCondition)
            .skip(skip)
            .limit(Number(limit));

        if (!products) {
            return res.status(404).send({ status: 404, message: "Product not found" })
        }

        const totalRecord = await Product.countDocuments(filters);

        return res.status(200).json({
            status: 200,
            products,
            pagination: {
                totalRecord,
                limit: Number(limit),
                skip: Number(skip),
                totalPages: (Math.ceil(totalRecord / Number(limit)))
            }
        });
    } catch (error) {
        console.log("Products Error", error);
        res.status(500).send({
            status: 500,
            message: "Server Error",
            error: error.message,
        });
    }
};

const getSingleProduct = async (req, res) => {
    const { id } = req.params;
    try {

        if (!id) {
            return res.status(400).send({ status: 400, message: "No id provided" })
        }

        const singleProduct = await Product.findById(id);

        if (!singleProduct) {
            return res.status(404).send({ status: 404, message: "Product not found" });
        }

        const similarProducts = await Product.find({
            brand: singleProduct.brand,
            _id: { $ne: singleProduct._id }, // exclude same product
        });

        res.status(200).send({ status: 200, singleProduct, similarProducts })
    } catch (error) {
        console.log("Single Prodcut Error", error.message);
        res.status(500).send({ status: 500, message: "Internal server error", error: error.message })
    }
}

const findProducts = async (req, res) => {
    try {

        const { find } = req.params;

        const { ...filters } = req.query;

        const products = await Product.distinct(find, filters);

        if (!products) {
            return res.status(404).send({ status: 404, message: "No product found" })
        }

        res.status(200).send({ status: 200, products })
    } catch (error) {
        console.log("Products Error", error);
        res.status(500).send({
            status: 500,
            message: "Server Error",
            error: error.message,
        });
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

export { getAllProducts, addProduct, deleteProduct, editProduct, findProducts, getSingleProduct }