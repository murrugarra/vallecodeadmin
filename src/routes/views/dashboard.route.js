const express = require("express");
const authMiddleware = require("../../middlewares/auth.middleware");
const router = express.Router();

/**
 * Route to render the dashboard page
 * @route GET /dashboard or /dash
 * @access Protected (requires authentication)
 * @middleware authMiddleware - Ensures the user is authenticated
 */
router.get(["/dashboard", "/dash"], authMiddleware, (req, res) => {
    res.status(200).render("dashboard", {
        title: "Dashboard", // Page title
        layout: "layouts/main", // Layout to use for rendering
        partialLayout: "../layouts/dashboard",
    });
});

module.exports = router;
