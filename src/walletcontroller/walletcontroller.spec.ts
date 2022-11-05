// Imports
import {Wallet, walletActions} from "./walletcontroller"
import { memoryDbActions } from "../walletservice/walletservice"

// Establish in-memory test db
const testMemoryDb : Wallet[] = [
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
        coins: 200,
        version: 5,
        lastTransactionId: "tx23",
        lastTransactionAmount: 20,
        lastTransactionType: "debit"
    },
    {
        walletId: "existingWallet3",
        coins: 100,
        version: 2,
        lastTransactionId: "tx02",
        lastTransactionAmount: 10,
        lastTransactionType: "debit"
    },
    {
        walletId: "existingWallet4",
        coins: 1000,
        version: 1,
        lastTransactionId: "tx01",
        lastTransactionAmount: 1000,
        lastTransactionType: "credit"
    }
]

// Establish suite of unit tests
describe("Tests for Wallet Transaction Functionality", () => {
    const testWallet = walletActions(memoryDbActions(testMemoryDb));
    
    describe("Testing Wallet Balance Check function", () => {
        test("Given an unknown walletId => when balance check is requested => should return transaction result with failure note and no wallet details", async () => {
            expect(await testWallet.find("unknownwallet1")).toEqual({
                outcome: "Invalid Wallet Id",
                wallet: null
            });
        });

        test("Give a known walletId => when balance check is requested => should return transaction result with success note and wallet details", async () => {
            expect(await testWallet.find("existingWallet1")).toEqual({
                outcome: "Wallet found",
                wallet: {
                    walletId: "existingWallet1",
                    coins: 1,
                    version: 1,
                    lastTransactionId: "tx01",
                    lastTransactionAmount: 1,
                    lastTransactionType: "credit"
                }
            });
        });
    });

    describe("Testing wallet Credit function", () => {
        test("Given an existing wallet => if duplicate credit is requested => should return transaction result with duplicate transaction note and unchanged wallet", async () => {
            expect(await testWallet.credit({walletId: "existingWallet1", coins: 1, transactionId: "tx01"})).toEqual({
                outcome: "Duplicate Transaction",
                wallet: {
                    walletId: "existingWallet1",
                    coins: 1,
                    version: 1,
                    lastTransactionId: "tx01",
                    lastTransactionAmount: 1,
                    lastTransactionType: "credit"
                }
            });
        });

        test("Given an existing wallet => if non-duplicate credit is requested => should return transaction result with success note and updated wallet", async () => {
            expect(await testWallet.credit({walletId: "existingWallet2", coins: 10, transactionId: "tx24"})).toEqual({
                outcome: "Credit successful",
                wallet: {
                    walletId: "existingWallet2",
                    coins: 210,
                    version: 6,
                    lastTransactionId: "tx24",
                    lastTransactionAmount: 10,
                    lastTransactionType: "credit"
                }
            });
        });

        test("Given an unknown walletId => if a credit transaction is requested => should return transaction result with success note and created wallet", async () => {
            expect(await testWallet.credit({walletId: "createdWallet1", coins: 1, transactionId: "tx01"})).toEqual({
                outcome: "New wallet created",
                wallet: {
                    walletId: "createdWallet1",
                    coins: 1,
                    version: 1,
                    lastTransactionId: "tx01",
                    lastTransactionAmount: 1,
                    lastTransactionType: "credit" 
                }
            })
        })
    });

    describe("Testing wallet Debit function", () => {
        test("Given an existing wallet => if duplicate debit is requested => should return transaction result with duplicate transaction note and unchanged wallet", async () => {
            expect(await testWallet.debit({walletId: "existingWallet3", coins: 10, transactionId: "tx02"})).toEqual({
                outcome: "Duplicate Transaction",
                wallet: {
                    walletId: "existingWallet3",
                    coins: 100,
                    version: 2,
                    lastTransactionId: "tx02",
                    lastTransactionAmount: 10,
                    lastTransactionType: "debit"
                }
            });
        });

        test("Given an existing wallet => if overdraft debit is requested => should return transaction result with overdraft note and unchanged wallet", async () => {
            expect(await testWallet.debit({walletId: "existingWallet3", coins: 10000, transactionId: "tx03"})).toEqual({
                outcome: "Overdraft attempt",
                wallet: {
                    walletId: "existingWallet3",
                    coins: 100,
                    version: 2,
                    lastTransactionId: "tx02",
                    lastTransactionAmount: 10,
                    lastTransactionType: "debit"
                }
            });
        });

        test("Given an existing wallet => if non duplicate, non overdraft debit is requested => should return transaction result with success note and updated wallet", async () => {
            expect(await testWallet.debit({walletId: "existingWallet4", coins: 100, transactionId: "tx02"})).toEqual({
                outcome: "Debit successful",
                wallet: {
                    walletId: "existingWallet4",
                    coins: 900,
                    version: 2,
                    lastTransactionId: "tx02",
                    lastTransactionAmount: 100,
                    lastTransactionType: "debit"
                }
            });
        });

        test("Given an unknown walletId => if debit transaction is requested => should return transaction result with failure note and null wallet", async () => {
            expect(await testWallet.debit({walletId: "unknownWallet2", coins: 100, transactionId: "tx01"})).toEqual({
                outcome: "Error. Invalid Wallet Id",
                wallet: null
            });
        });
    });
});

