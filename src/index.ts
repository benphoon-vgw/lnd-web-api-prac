// Imports
import express from "express";

// Initialse server instance
const app = express();

// Middleware
app.use(express.json());

// Define Routes
app.get("/", (req, res) => {
    res.send("Server working")
});

// Start Server
app.listen(8080);