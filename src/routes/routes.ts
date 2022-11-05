// Routes directs HTTP requests to correct endpoints
// Imports
import express from 'express';
import { WalletActions } from '../walletcontroller/walletcontroller';


// Define interfaces
export interface TransactionDetails {
    walletId: string,
    transactionId: string,
    coins: number
}

// Establish router instance
export const walletRoutes = (walletActions : WalletActions) => {
    const router = express.Router();

    // GET balance
    router.get("/:walletId", async (req, res) => {
        const result = await walletActions.find(req.params.walletId);
        switch (result.outcome) {
            case "Wallet found":
                res.status(200);
                break
            case "Invalid Wallet Id":
                res.status(404)
                break
        }
        res.send(result.wallet)
    });
    
    // POST - Credit wallet
    router.post("/:walletId/credit", async (req, res) => {
        const result = await walletActions.credit({walletId: req.params.walletId, coins: req.body.coins, transactionId: req.body.transactionId});        
        switch (result.outcome) {
            case "Duplicate Transaction":
        }
    });

    return router
}
