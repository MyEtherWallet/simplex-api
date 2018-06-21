"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
require('dotenv').config();
var network = {
    port: process.env.PORT || 8080
};
var db = {
    host: process.env.DATA_MONGODB_HOST || "",
    name: "gonano"
};
var simplex = {
    walletID: process.env.WALLET_ID || "",
    quoteEP: process.env.QUOTE_EP || "",
    orderEP: process.env.ORDER_EP || "",
    paymentEP: process.env.PAYMENT_EP || "",
    apiKey: process.env.SIMPLEX_APIKEY || "",
    apiVersion: "1",
    validFiat: ["EUR", "USD"],
    validDigital: ["BTC", "ETH"],
    status: {
        initiated: "INITIATED",
        sentToSimplex: "SENT_TO_SIMPLEX",
        deniedSimplex: "DENIED_SIMPLEX",
        processingSimplex: "PROCESSING_SIMPPLEX",
        successSimplex: "SUCCESS_SIMPLEX"

    }
};
var mangodb = {
    host: process.env.DATA_MONGODB_HOST,
    port: 27017,
    name: 'gonano'
};
exports.network = network;
exports.db = db;
exports.simplex = simplex;
exports.mangodb = mangodb;