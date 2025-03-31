/**
 * Load necessary modules and configurations
 */
const app = require("./src/app");
const connection = require("./src/config/database");

const PORT = process.env.PORT || 3000;

/**
 * Connect to the database before starting the server
 */
connection()
    .then(() => {
        app.listen(PORT, () => {
            console.log("Server running on port " + PORT);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB");
        console.error(error);
        process.exit(1);
    });
