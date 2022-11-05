// Imports

// Wallet Service unit tests
describe("Tests for Database Search Functionality", () => {
    test("Given unknown walletId => if search for wallet is requested => will return 'wallet not found' and undefined wallet details", async () => {
        expect(await searchDatabase("unknownwallet")).toEqual({
            transactionResult: "Wallet not found",
            walletDetails: {
                walletId: "unknownwallet",
                coins: undefined,
                version: undefined,
                lastTransactionId: undefined
            }
        })
    })
});

