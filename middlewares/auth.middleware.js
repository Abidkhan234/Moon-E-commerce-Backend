import jwt from 'jsonwebtoken'
import "dotenv/config"

const authMiddleware = async (req, res, next) => {
    try {

        const header = req.headers["authorization"];

        if (!header) {
            return res.status(400).send({ status: 400, message: "Login first" })
        }

        const token = header.split(" ")[1];

        const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        if (!userData) {
            return res.status(400).send({ status: 400, message: "Invalid Token" })
        }

        req.userData = userData

        next();
    } catch (error) {
        console.log(error);
        if (error.message.includes("jwt expired") || error.message.includes("invalid token")) {
            return res.status(401).send({ status: 401, message: "Token expired" });
        }
        return res.status(500).send({ status: 500, message: "Internal Error" });
    }
}

export default authMiddleware