// Imports
import express from "express";
import request from 'supertest';
import { Wallet, walletActions } from "../walletcontroller/walletcontroller";
import { memoryDbActions } from "../walletservice/walletservice";
import { walletRoutes } from "./routes";

const testMemoryDb : Wallet[] = [];

// Establish Test Server
const testServer = express().use(express.json()).use('/wallets', walletRoutes(walletActions(memoryDbActions(testMemoryDb)))).listen(3000);

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