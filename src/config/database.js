const mongoose = require("mongoose");

/**
 * Establish a connection to MongoDB
 */
const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Successfully connected to MongoDB");
    } catch (error) {
        console.log("Failed to connect to MongoDB");
        console.error(error);
        process.exit(1);
    }
};

module.exports = connection;
