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
        const transactionDetails : TransactionDetails = {
            walletId: req.params.walletId,
            transactionId: req.body.transactionId,
            coins: req.body.coins
        }
        // Find wallet
        const retrievedWallet = walletActions.find(req.params.walletId);
        // Create wallet if it does not exist
        if ((await retrievedWallet).wallet) {
            walletActions.credit(transactionDetails);

        } else {
            walletActions.create(transactionDetails)
        }
        // Credit wallet if not duplicate
        
        
        
        
        const result = await walletActions.create(transactionDetails);
        res.status(201).send(result.wallet);
    });

    return router
}
