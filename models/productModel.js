import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: [String],
        required: true,
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
    },
    image: {
        type: {
            url: {
                type: String
            },
            public_id: {
                type: String
            }
        },
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