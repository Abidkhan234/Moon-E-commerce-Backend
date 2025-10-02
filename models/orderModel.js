import mongoose from 'mongoose'

const productDetailSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
}, { _id: false })

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productDetails: [productDetailSchema]
},
    { timestamps: true }
)

const Order = mongoose.model("Order", orderSchema);

export default Order