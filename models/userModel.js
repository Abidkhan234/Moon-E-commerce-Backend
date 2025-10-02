import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "Username is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Minimum 6 characters"],
        select: false
    },
    refreshToken: {
        default: null,
        type: String
    },
    cartItems: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            itemQuantity: { type: Number, default: 1 },
        }
    ],
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (error) {
        console.error("User Model Pre Error", error);
        next(error);
    }
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

const User = mongoose.model("User", userSchema);

export default User