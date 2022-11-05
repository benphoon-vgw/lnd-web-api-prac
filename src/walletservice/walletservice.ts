// Wallet Service queries and inputs data into database (in-memory or postgres)
// Imports
import {Pool} from "pg";
import { Wallet } from "../walletcontroller/walletcontroller";

// Define interfaces
export interface DatabaseActions {
    save: (wallet: Wallet) => Promise<Wallet>,
    load: (walletId: string) => Promise<Wallet | undefined>
}

export const memoryDbActions = (db: Wallet[]) : DatabaseActions => {
    return {
        save: async (wallet) => {
            const walletIndex = db.findIndex((savedWallet) => {savedWallet.walletId === wallet.walletId});
            if (walletIndex === -1) {
                db.push(wallet);
                return wallet;
            } else {
                db[walletIndex] = wallet;
                return db[walletIndex];
            }
        },
        load: async (walletId) => {
            const wallet = await db.find(wallet => wallet.walletId === walletId);
            return wallet;
        }
    }
}

// export const postgresDb = (db: Pool) : DatabaseActions => {
//     return {
//         save: ,
//         load: 
//     }
// }




