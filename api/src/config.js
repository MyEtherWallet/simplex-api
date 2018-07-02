require('dotenv').config({
    path: '../.env'
})
let network = {
    port: process.env.PORT || 8080
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
    host: process.env.DATA_MONGODB_HOST || '',
    port: 27017,
    name: 'gonano'
}
let recaptcha = {
    siteKey: process.env.RECAPTCHA_SITE_KEY || '',
    secretKey: process.env.RECAPTCHA_SECRET_KEY || '',
}
let env = {
    mode: process.env.NODE_ENV || 'production',
    dev: {
        ip:'141.145.165.137',
        accept_language:'en-US,en;q=0.9',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36'
    }
}
export {
    network,
    simplex,
    mangodb,
    recaptcha,
    env
}