const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate users using JWT
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authMiddleware = (req, res, next) => {
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

    // If no token is found, redirect to the login page
    if (!token) {
        return res.status(301).redirect("/login"); // Redirect to login if no token is provided
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded user information to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        // If the token is invalid, redirect to the login page
        return res.status(301).redirect("/login"); // Redirect to login if the token is invalid
    }
};

module.exports = authMiddleware;
