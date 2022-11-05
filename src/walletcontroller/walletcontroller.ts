// Wallet Controller holds logic for wallet transactions
// Imports
import { TransactionDetails } from "../routes/routes"
import { DatabaseActions } from "../walletservice/walletservice"

// Define interfaces
export interface Wallet {
    walletId: string,
	coins: number,
	version: number,
	lastTransactionId: string | undefined,
	lastTransactionType: string | undefined, //modify this in function - after modifying coin balance
	lastTransactionAmount: number | undefined
}

export interface WalletActions {
    find: (walletId : string) => Promise<TransactionResult>,
    credit: (transactionDetails : TransactionDetails) => Promise<TransactionResult>,
    debit: (transactionDetails : TransactionDetails) => Promise<TransactionResult | undefined>
}

export interface TransactionResult {
    outcome: string,
    wallet: Wallet | null
}

export const walletActions = (databaseActions : DatabaseActions) : WalletActions => {
    return {
        find: async (walletId) => {
            const retrievedWallet = await databaseActions.load(walletId);
            if (retrievedWallet) {
                return {
                    outcome: "Wallet found",
                    wallet: retrievedWallet
                };
            } else {
                return {
                    outcome: "Invalid Wallet Id",
                    wallet: null
                };
            };
        },
        credit: async (transactionDetails) => {
            const retrievedWallet = await databaseActions.load(transactionDetails.walletId);
            if (retrievedWallet && retrievedWallet.lastTransactionId === transactionDetails.transactionId) {
                return {
                    outcome: "Duplicate Transaction",
                    wallet: retrievedWallet
                };
            } else if (retrievedWallet && retrievedWallet.lastTransactionId != transactionDetails.transactionId) {
                const updatedWallet = {
                    walletId: retrievedWallet.walletId,
                    coins: retrievedWallet.coins + transactionDetails.coins,
                    version: retrievedWallet.version + 1,
                    lastTransactionId: transactionDetails.transactionId,
                    lastTransactionType: "credit",
                    lastTransactionAmount: transactionDetails.coins
                };
                await databaseActions.save(updatedWallet);
                return {
                    outcome: "Credit successful",
                    wallet: updatedWallet
                };
            } else {
                const newWallet = {
                    walletId: transactionDetails.walletId,
                    coins: transactionDetails.coins,
                    version: 1,
                    lastTransactionId: transactionDetails.transactionId,
                    lastTransactionType: "credit",
                    lastTransactionAmount: transactionDetails.coins
                };
                await databaseActions.save(newWallet);
                return {
                    outcome: "New wallet created",
                    wallet: newWallet
                };
            };
        },
        debit: async (transactionDetails) => {
            const retrievedWallet = await databaseActions.load(transactionDetails.walletId);
            if (retrievedWallet && retrievedWallet.lastTransactionId === transactionDetails.transactionId) {
                return {
                    outcome: "Duplicate Transaction",
                    wallet: retrievedWallet
                };
                
            } else if (retrievedWallet && retrievedWallet.lastTransactionId != transactionDetails.transactionId) {
                if (transactionDetails.coins > retrievedWallet.coins) {
                    return {
                        outcome: "Overdraft attempt",
                        wallet: retrievedWallet
                    };
                } else {
                    const updatedWallet = {
                        walletId: retrievedWallet.walletId,
                        coins: retrievedWallet.coins - transactionDetails.coins,
                        version: retrievedWallet.version + 1,
                        lastTransactionId: transactionDetails.transactionId,
                        lastTransactionType: "debit",
                        lastTransactionAmount: transactionDetails.coins
                    };
                    await databaseActions.save(updatedWallet);
                    return {
                        outcome: "Debit successful",
                        wallet: updatedWallet
                    };
                }
            } else {
                return {
                    outcome: "Error. Invalid Wallet Id",
                    wallet: null
                };
            }
        }
    }
}