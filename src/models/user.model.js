const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the user schema
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true }, // User's full name
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"], // Email format validation
    },
    password: { type: String, required: true }, // User's hashed password
    dni: {
        type: String,
        required: true,
        unique: true,
        match: [/^\d{8}$/, "DNI must contain exactly 8 numeric digits"], // DNI format validation
    },
    role: {
        type: String,
        enum: ["admin", "developer"], // Allowed roles
        default: "developer", // Default role
    },
    estado: {
        type: String,
        enum: ["activo", "inactivo"], // User status
        default: "activo", // Default status
    },
    createdAt: { type: Date, default: Date.now }, // Timestamp for user creation
});

// Middleware to hash the password before saving it to the database
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // Skip if the password is not modified
    try {
        this.password = await bcrypt.hash(this.password, 10); // Hash the password with a salt factor of 10
        next();
    } catch (error) {
        next(error); // Pass the error to the next middleware
    }
});

// Method to compare a plain-text password with the hashed password
UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password); // Return true if passwords match
};

module.exports = mongoose.model("User", UserSchema);
