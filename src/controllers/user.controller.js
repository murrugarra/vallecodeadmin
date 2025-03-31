const User = require("../models/user.model");
const Log = require("../models/log.model");

class UserController {
    /**
     * Fetch and return a list of all users
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static async list(req, res) {
        try {
            const users = await User.find(); // Retrieve all users from the database
            res.status(200).json(users); // Respond with the list of users
        } catch (error) {
            res.status(500).json({
                error: "Error fetching users", // Error message for the client
                details: error.message, // Detailed error message for debugging
            });
        }
    }

    /**
     * Create a new user and log the action
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static async create(req, res) {
        const session = await User.startSession(); // Start a new MongoDB session
        session.startTransaction(); // Begin a transaction
        try {
            const { name, email, password, dni, role } = req.body;

            // Validate required fields
            if (!name || !email || !password || !dni || !role) {
                return res.status(400).json({
                    error: "Missing required fields to create a user", // Inform the client about missing fields
                });
            }

            // Create a new user
            const newUser = new User({ name, email, password, dni, role });
            await newUser.save({ session }); // Save the user within the transaction

            // Log the action
            await Log.create(
                [
                    {
                        user: req.user ? req.user.id : newUser._id, // Use authenticated user ID or the new user's ID
                        action: "CREATE", // Action type
                        targetCollection: "users", // Affected collection
                        documentId: newUser._id, // ID of the created user
                        targetIp: req.ip, // IP address of the request
                    },
                ],
                { session }
            );

            await session.commitTransaction(); // Commit the transaction
            session.endSession(); // End the session

            res.status(201).json({
                message: "User created successfully.", // Success message for the client
                user: newUser, // Return the created user
            });
        } catch (error) {
            await session.abortTransaction(); // Roll back the transaction in case of an error
            session.endSession(); // End the session

            res.status(500).json({
                error: "Error creating user", // Error message for the client
                details: error.message, // Detailed error message for debugging
            });
        }
    }
}

module.exports = UserController;
