// Imports
import express from "express";
import request from 'supertest';
import { walletRouter } from "./routes";

// Establish Test Server
const testServer = express().use(express.json()).use('/wallets', walletRouter).listen(3000);

// Unit Tests for Routes
describe("GET /wallets/:walletId", () => {
    test("Given an unknown walletId => when request for wallet balance is made => should return 404 status code", async () => {
        const response = await request(testServer).get('/wallets/unknownWallet').send();
        expect(response.status).toBe(404)
    });
})



// Close server
afterAll(() => {
    testServer.close()
  })