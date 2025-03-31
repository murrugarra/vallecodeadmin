const mongoose = require("mongoose");

// Define the log schema
const LogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }, // The user who performed the action
    action: {
        type: String,
        enum: ["LOGIN", "CREATE", "UPDATE", "DELETE", "FIND"], // Allowed action types
        required: true,
    }, // The type of action performed
    targetCollection: {
        type: String,
        required: true,
    }, // The affected collection (e.g., "clients", "projects")
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
    }, // The ID of the affected document (if applicable)
    targetIp: {
        type: String,
        required: true,
    }, // The IP address from which the action was performed
    timestamp: {
        type: Date,
        default: Date.now,
    }, // The date and time when the action occurred
});

module.exports = mongoose.model("Log", LogSchema);
