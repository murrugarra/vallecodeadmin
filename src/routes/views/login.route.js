const express = require("express");
const authVerificationMiddleware = require("../../middlewares/authVerification.middleware");
const router = express.Router();

/**
 * Route to render the login page
 * @route GET / or /login
 * @access Public
 * @middleware authVerificationMiddleware - Redirects authenticated users to the dashboard
 */
router.get(["/", "/login"], authVerificationMiddleware, (req, res) => {
    if (req.user) {
        return res.status(301).redirect("/dashboard"); // Redirect if the user is already authenticated
    }
    res.status(200).render("login", { title: "Login", layout: "layouts/auth" }); // Render the login page with the specified layout
});

module.exports = router;
