require('dotenv').config()
let network = {
    port: process.env.PORT || 8080
}
let db = {
    host: process.env.DATA_MONGODB_HOST || "",
    name: "gonano"
}
let simplex = {
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
}
let mangodb = {
    host: process.env.DATA_MONGODB_HOST,
    port: 27017,
    name: 'gonano'
}
export {
    network,
    db,
    simplex,
    mangodb
}