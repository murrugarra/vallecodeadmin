const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

/**
 * Route to list all users
 * @route GET /list
 * @access Protected (requires authentication)
 */
router.get("/list", authMiddleware, UserController.list); // List all users

/**
 * Route to create a new user
 * @route POST /create
 * @access Protected (requires authentication)
 */
router.post("/create", authMiddleware, UserController.create); // Create a new user

module.exports = router;
