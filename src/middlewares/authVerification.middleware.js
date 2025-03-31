const jwt = require("jsonwebtoken");

/**
 * Middleware to verify if a user is already authenticated
 * Redirects authenticated users to the dashboard
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authVerificationMiddleware = (req, res, next) => {
    let token = null;

    // Check if the token is present in cookies
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    // Check if the token is present in the Authorization header
    else if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        token = req.headers.authorization.split(" ")[1]; // Extract the token from the header
    }

    if (token) {
        try {
            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Attach the user information to the request object
            return res.redirect("/dashboard"); // Redirect if the user is already authenticated
        } catch (error) {
            console.error("Invalid token:", error.message); // Log the error for debugging
        }
    }

    next(); // Proceed to the next middleware if no token is found or if it is invalid
};

module.exports = authVerificationMiddleware;
