import Order from "../../models/orderModel.js";

const addOrder = async (req, res) => {
    try {
        const { user, body } = req;

        const order = await Order.create({ userId: user._id, ...body });

        res.status(200).send({ status: 200, message: "Order placed successfully", orderId: order?._id });
    } catch (error) {
        console.log("Add Order Error", error.message);
        res.status(500).send({ status: 500, message: "Internal Server Error", error: error.message });
    }
}

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

        const products = orders[0].products;

        res.status(200).send({ status: 200, products })
    } catch (error) {
        console.log("Get Orders Error", error.message);
        res.status(500).send({ status: 500, message: "Internal Server Error", error: error.message });
    }
}

export { addOrder, getOrders }