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
    apiKey: process.env.SIMPLEX_APIKEY || ""
}
export {
    network,
    db,
    simplex
}