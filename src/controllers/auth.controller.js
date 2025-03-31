const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Log = require("../models/log.model");

class AuthController {
    /**
     * Handle user login and issue a JWT token
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validate required fields
            if (!email || !password) {
                return res
                    .status(400)
                    .json({ message: "Missing email or password" });
            }

            // Find the user by email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Check if the user is active
            if (user.estado !== "activo") {
                return res.status(403).json({ message: "User is inactive" });
            }

            // Verify the password
            const match = await user.comparePassword(password);
            if (!match) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            // Generate a JWT token
            const token = jwt.sign(
                {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    dni: user.dni,
                    role: user.role,
                },
                process.env.JWT_SECRET,
                { expiresIn: "1d" } // Token expires in 1 day
            );

            // Log the login action
            await Log.create({
                user: user._id,
                action: "LOGIN",
                targetCollection: "users",
                documentId: user._id,
                targetIp: req.ip,
            });

            // Set the token as an HTTP-only cookie
            res.cookie("token", token, {
                httpOnly: true, // Protects against XSS attacks
                secure: false, // Set to true if using HTTPS
                sameSite: "Lax", // Restrict cross-site requests
                maxAge: 24 * 60 * 60 * 1000, // Cookie expires in 1 day
            });

            res.status(200).json({ message: "Login successful" });
        } catch (error) {
            res.status(500).json({
                error: "Error during login",
                details: error.message,
            });
        }
    }

    /**
     * Handle user logout by clearing the JWT cookie
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static async logout(req, res) {
        res.clearCookie("token"); // Clear the token cookie
        res.status(200).json({ message: "Logout successful" });
    }

    /**
     * Retrieve user information from the JWT token in cookies
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static async getInfoCookie(req, res) {
        const token = req.cookies.token; // Retrieve the token from cookies
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized. Please provide your credentials.",
            });
        }

        try {
            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            res.json({ message: "Access granted", user: decoded }); // Return decoded user info
        } catch (error) {
            res.status(403).json({ message: "Invalid token" }); // Token verification failed
        }
    }
}

module.exports = AuthController;
