import Order from "../../models/orderModel.js";

const addOrder = async (req, res) => {
    try {
        const { user, body } = req;
        const { productDetails } = body;

        // Update existing order if found, otherwise create a new one
        const order = await Order.findOneAndUpdate(
            { userId: user._id }, // match existing order by user
            {
                $push: { productDetails: { $each: productDetails } }, // push new products
            },
            { new: true, upsert: true } // return updated doc, create if not exists
        );

        res.status(200).send({
            status: 200,
            message: order.createdAt ? "Order placed successfully" : "Products added to existing order",
            orderId: order._id,
        });
    } catch (error) {
        console.log("Add Order Error", error.message);
        res.status(500).send({
            status: 500,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};


const getOrders = async (req, res) => {
    try {

        const { user } = req;

        const orders = await Order.aggregate([
            {
                $match: {
                    userId: user._id
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productDetails.id",
                    foreignField: "_id",
                    as: "products"
                }
            },
        ]);

        const products = orders[0]?.products;

        if (!products) {
            return res.status(404).send({ status: 404, message: "Product not found" })
        }

        res.status(200).send({ status: 200, products })
    } catch (error) {
        console.log("Get Orders Error", error.message);
        res.status(500).send({ status: 500, message: "Internal Server Error", error: error.message });
    }
}

export { addOrder, getOrders }