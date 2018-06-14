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
    apiKey: process.env.SIMPLEX_APIKEY || ""
};
exports.network = network;
exports.db = db;
exports.simplex = simplex;