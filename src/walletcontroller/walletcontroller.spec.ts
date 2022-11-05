// Imports

// Unit tests for wallet controller
describe("Testing Wallet Balance Check function", () => {
    test("Given an unknown wallet ID => when balance check is requested => should return 404 status and wallet with undefined details", async () => {
        expect(await checkWallet("unknownwallet")).toEqual({
            transactionResult: "Wallet not found",
            walletDetails: {
                walletId: 'unknownwallet',
                coins: undefined,
                version: undefined,
                lastTransactionId: undefined
            }
        })
    })
})

