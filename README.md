# Simplex backend API

Full backend api to integrate simplex crypto api powered by nanobox

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Setup `.env` file with following variable
```
WALLET_ID=
QUOTE_EP=https://sandbox.test-simplexcc.com/wallet/merchant/v2/quote
ORDER_EP=https://sandbox.test-simplexcc.com/wallet/merchant/v2/payments/partner/data
PAYMENT_EP=https://sandbox.test-simplexcc.com/payments/new
SIMPLEX_APIKEY=
RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
API_HOST=
```

### Installing
Refer to [Install nanobox](https://docs.nanobox.io/install/) for instructions on how to install nanobox
```
npm install
```

## Running the tests

```
npm run test
```

## Deployment

```
nanobox deploy
```

## Deploy in local machine

```
nanobox deploy dry-run
```


## External APIs

### Status
- /status/[userId]\
    where userId is the same user_id used to generate the order

## Built With

* [ExpressJS](https://expressjs.com/) - The web framework
* [Mocha](https://mochajs.org/) - The testing framework
* [Nanobox](http://www.nanobox.io/) - The deployment framework

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

