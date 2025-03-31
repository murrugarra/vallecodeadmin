require("dotenv").config(); // Load environment variables from .env file

/**
 * Native dependencies
 */
const path = require("path");

/**
 * Third-party dependencies
 */
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");

/**
 * Initialize the application
 */
const app = express();
app.set("view engine", "ejs"); // Set EJS as the template engine
app.set("views", path.join(__dirname, "views")); // Define the views directory
app.set("layout", path.join(__dirname, "views/layouts/main")); // Set the main layout for EJS

/**
 * Middlewares
 */
app.use(morgan("dev")); // Log HTTP requests to the console
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Enable cookie parsing
app.use(expressLayouts); // Enable layouts for EJS

/**
 * CORS configuration
 */
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:3000", // Allow requests from the specified origin
        methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
        allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    })
);

/**
 * Static files
 */
app.use(express.static(path.join(__dirname, "../public"))); // Serve static files from the public directory

/**
 * Routes
 */
app.use("/", require("./routes/views/login.route")); // Login view routes
app.use("/", require("./routes/views/dashboard.route")); // Dashboard view routes
app.use("/api/auth", require("./routes/auth.route")); // Authentication API routes
app.use("/api/users", require("./routes/user.route")); // User API routes

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace
    res.status(500).json({
        error: "An internal server error occurred", // Send a generic error message to the client
        details:
            process.env.NODE_ENV === "development" ? err.message : undefined, // Include error details in development mode
    });
});

module.exports = app;
