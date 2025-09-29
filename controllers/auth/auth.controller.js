import User from "../../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { generateAccessToken, generateRefreshToken } from "../../utils/generateToken.js";

const registerUser = async (req, res) => {
    try {
        const { email, userName, password } = req.body;

        const user = await User.findOne({ email });

        if (user) {
            return res.status(409).send({ status: 409, message: "Email already exits" })
        }

        const hashPassword = bcrypt.hashSync(password, 10)

        await User.create({
            email,
            userName,
            password: hashPassword
        })

        return res.status(200).send({ status: 200, message: "Sign up successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 500, message: "Internal server error" })
    }
}

const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;


        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(404).send({ status: 404, message: "Email not found" })
        }

        const isValidPassword = bcrypt.compareSync(password, user.password);

        if (!isValidPassword) {
            return res.status(400).send({ status: 400, message: "Incorrect password" })
        }

        const accessToken = generateAccessToken("5m", email, user._id, user.userName);

        const refreshToken = generateRefreshToken("15m", user._id);

        user.refreshToken = refreshToken;

        await user.save();

        return res.status(200).send({ status: 200, message: "Login successfully", accessToken, refreshToken })
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 500, message: "Internal server error" })
    }
}

const logoutUser = (req, res) => {
    res.status(200).send({ status: 200, message: "Logout successfully" });
}

const refreshAccessToken = async (req, res) => {
    try {

        const { refreshToken } = req.body;

        const { id } = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await User.findOne({ _id: id });

        if (!user) {
            return res.status(404).send({ status: 404, message: "User not found" })
        }

        const newAccessToken = generateAccessToken("5m", user.email, user._id, user.userName);

        return res.status(200).send({ status: 200, accessToken: newAccessToken });
    } catch (error) {
        console.log(error);
        if (error.message.includes("jwt expired") || error.message.includes("invalid token")) {
            return res.status(401).send({ status: 401, message: "Token expired" });
        }
        return res.status(500).send({ status: 500, message: "Internal Error" });
    }
}

export { loginUser, registerUser, refreshAccessToken, logoutUser }
