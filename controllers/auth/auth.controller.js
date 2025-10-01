import User from "../../models/userModel.js";
import jwt from 'jsonwebtoken'

import { generateAccessToken, generateRefreshToken } from "../../utils/generateToken.js";

const registerUser = async (req, res) => {
    try {
        const { email, userName, password } = req.body;

        const user = await User.findOne({ email });

        if (user) {
            return res.status(409).send({ status: 409, message: "Email already exits" })
        }

        await User.create({
            email,
            userName,
            password
        })

        return res.status(201).send({ status: 201, message: "Sign up successfully" });
    } catch (error) {
        console.log("Register Error", error);
        res.status(500).send({ status: 500, message: error.message })
    }
}

const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(404).send({ status: 404, message: "User not found" });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).send({ status: 401, message: "Invalid credentials" });
        }

        const accessToken = generateAccessToken("15m", email, user._id, user.userName);

        const refreshToken = generateRefreshToken("1d", user._id);

        user.refreshToken = refreshToken;

        await user.save();

        return res.status(200).send({ status: 200, message: "Login successfully", accessToken, refreshToken })
    } catch (error) {
        console.log("Login Error", error);
        res.status(500).send({ status: 500, message: "Internal server error" })
    }
}

const logoutUser = (req, res) => {
    res.status(200).send({ status: 200, message: "Logout successfully" });
}

const refreshAccessToken = async (req, res) => {
    try {

        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).send({ status: 400, message: "Refresh token not provided" })
        }

        const { id } = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).send({ status: 404, message: "User not found" })
        }

        const tokenExits = user.refreshToken.includes(refreshToken);

        if (!tokenExits) {
            return res.status(401).send({ status: 401, message: "Refresh token invalid or revoked" });
        }

        const newAccessToken = generateAccessToken("15m", user.email, user._id, user.userName);

        return res.status(200).send({ status: 200, accessToken: newAccessToken });
    } catch (error) {
        console.log("Refresh token error", error);
        if (error.message.includes("jwt expired") || error.message.includes("invalid token")) {
            return res.status(401).send({ status: 401, message: "Token expired" });
        }
        return res.status(500).send({ status: 500, message: "Internal Error" });
    }
}

export { loginUser, registerUser, refreshAccessToken, logoutUser }
