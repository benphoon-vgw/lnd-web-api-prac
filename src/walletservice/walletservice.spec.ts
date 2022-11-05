// Imports
import {DatabaseActions, memoryDbActions} from "./walletservice" 
import { Pool } from "pg";
import { Wallet } from "../walletcontroller/walletcontroller";


// Establish suite of unit tests
const testSuite = (databaseActions : DatabaseActions) : void => {
    describe("Tests for Database Functionality", () => {
        
        test("Given known walletId => if search for wallet is requested => will return correct wallet details", async () => {
            expect(await databaseActions.load("existingWallet1")).toEqual({
                walletId: "existingWallet1",
                coins: 1,
                version: 1,
                lastTransactionId: "tx01",
                lastTransactionAmount: 1,
                lastTransactionType: "credit"
            })
        })
        
        test("Given unknown walletId => if search for wallet is requested => will return 'undefined'", async () => {
            expect(await databaseActions.load("unknownwallet1")).toEqual(undefined);
        });

        test("Given unknown walletId => if save to database is requested => will add wallet details to db and return wallet", async () => {
            expect(await databaseActions.save({walletId: "createdWallet1", coins: 1, version: 1, lastTransactionId: "tx123", lastTransactionAmount: 1, lastTransactionType: "credit"}))
            .toEqual({walletId: "createdWallet1", coins: 1, version: 1, lastTransactionId: "tx123", lastTransactionAmount: 1, lastTransactionType: "credit"});
        })

        test("Given known walletId => if save to database is requested => will replace existing details in db and return updated wallet", async () => {
            expect(await databaseActions.save({walletId: "existingWallet2", coins: 3, version: 3, lastTransactionId: "tx03", lastTransactionAmount: 1, lastTransactionType: "credit"}))
            .toEqual({walletId: "existingWallet2", coins: 3, version: 3, lastTransactionId: "tx03", lastTransactionAmount: 1, lastTransactionType: "credit"})
        })
    });
};

describe("Database Tests", () => {
    
    // Establish test pools
    const testMemoryDb: Wallet[] = [
        {
            walletId: "existingWallet1",
            coins: 1,
            version: 1,
            lastTransactionId: "tx01",
            lastTransactionAmount: 1,
            lastTransactionType: "credit"
        },
        {
            walletId: "existingWallet2",
            coins: 2,
            version: 2,
            lastTransactionId: "tx02",
            lastTransactionAmount: 1,
            lastTransactionType: "debit"
        }
    ]

    // Run test suite
    describe("In-memory database", () => testSuite(memoryDbActions(testMemoryDb)));

})

