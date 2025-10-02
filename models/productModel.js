import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    public_id: {
        type: String,
        required: true
    },
},
    { _id: false }
);

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
        lowercase: true,
    },
    category: {
        type: [String],
        required: true,
        lowercase: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discountedPrice: {
        type: Number,
        default: 0,
        min: 0,
    },
    brand: {
        type: String,
        required: true,
        lowercase: true,
    },
    image: {
        type: imageSchema,
        required: true,
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
    { timestamps: true }
);


const Product = mongoose.model("Product", productSchema);

export default Product