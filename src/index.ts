// Imports
import express from "express";
import { Pool } from "pg";
import { walletRoutes } from "./routes/routes";
import { walletActions } from "./walletcontroller/walletcontroller";
import { memoryDbActions } from "./walletservice/walletservice";
import { Wallet } from "./walletcontroller/walletcontroller";

// Initialse server instance and variables
const app = express();
const port = 8080;


// Initialise Databases
    // In-Memory
    const memoryDb: Wallet[] = []

    // Postgres


// Middleware
app.use(express.json());

    // Define Routes
app.use("/wallets", walletRoutes(walletActions(memoryDbActions(memoryDb))));

// Start Server
app.listen(port, () => {
    console.log("Server is up and running!")
});