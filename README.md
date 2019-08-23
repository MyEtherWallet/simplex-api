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

API_KEY=
API_KEY_HEADER=apikey
IOS_REFERER=
ANDROID_REFERER=
```

## Local
### Installing
Start by installing the dependencies by running ```npm install``` in each of the api and frontend directories.

### Running
To start the two components locally run ```npm start``` in the api directory first followed by ```npm start``` in the frontend directories.



## Running the tests
```
npm run test
```

## Full Dockerized Deployment

## Pre-Deployment
Before deploying you need to use the .env file from 'Prerequisites' and depending on whether you follow method 1 or method 2 a nginx.conf file.
In either case you will need to replace the server name values to reflect your particular setup.  (I've denoted the items that need to be changed below as apiSubDomain.myDomain.com and frontendSubDomain.myDomain.com). 

**Method 1:**
Before deploying you need to create an .env and a nginx.conf file to place in the location where you will execute the deploy script.

**Method 2:**
Create a fork of the repository and update the /deploy/nginx.conf file and push those changes to your fork

Replacing apiSubDomain.myDomain.com and frontendSubDomain.myDomain.com with your urls. 

##### nginx.conf
```
events {}


http {
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=one:8m max_size=3000m inactive=600m;

gzip_comp_level 6;
gzip_vary on;
gzip_min_length  1000;
gzip_proxied any;
gzip_types text/plain text/css application/json application/x-javascript application/xml application/xml+rss text/javascript;
gzip_buffers 16 8k;

server {
    listen 80 default_server;
    listen [::]:80 default_server;
    return 200;
}
    server {
        listen 80;
        listen [::]:80;
        server_name apiSubDomain.myDomain.com;
        location / {
            proxy_pass http://api:8080;
            proxy_set_header Host            $host;
            proxy_set_header X-Forwarded-For $remote_addr;
        }
    }
        server {
            listen 80;
            listen [::]:80;
            server_name frontendSubDomain.myDomain.com;
            location / {
                proxy_pass http://frontend:8080;
                proxy_set_header Host            $host;
                proxy_set_header X-Forwarded-For $remote_addr;
            }
        }
}
```
## Deployment
To deploy move the .env, nginx.conf (if using method 1), and the setup.sh file located in /simplex-api/deploy to the location where you want to place your deployment.  Open a terminal in that directory and run ```bash ./setup.sh```  This will set up the environment including checking for and (if needed) installing docker and docker-compose.

Running the script with no arguments 
- checks for and installs docker and docker-compose
- checks for the presence of an .env file 
- clones the latest version of the repository
- builds the docker containers for the api and frontend
- starts the docker containers 



## External APIs



post requests:


### Quote 

- POST /quote\
    returns a quote for the provided input\
    parameter object:
    ```javascript
    {
    digital_currency: "",
    fiat_currency: '',
    requested_currency: "",
    requested_amount "" 'must be a number
    }
    ```
    - from currency
    - to currency
    - from amount

### Order

- POST /quote\
    returns a quote for the provided input\
    parameter object:
    ```javascript
    {
        account_details: {
          app_end_user_id: ""
        },
        transaction_details: {
          payment_details: {
            fiat_total_amount: {
              currency: "",
              amount: ""
            },
            requested_digital_amount: {
              currency: "",
              amount: ""
            },
            destination_wallet: {
              currency: "",
              address: ""
            }
          }
        }
      }
    ```
    Supplied in quote response:
    - app_end_user_id
    - fiat_total_amount.currency
    - fiat_total_amount.amount
    - requested_digital_amount.currency
    - requested_digital_amount.amount
    
    Additional in the order request:
    - destination_wallet.currency
    - destination_wallet.address

### Status 
- GET /status/:user_id\
    gets the latest status for the particular user_id
   - response:
    ```javascript

  {
      user_id: <string>,
      status: <string>,
      fiat_total_amount: {
          currency: <string>,
          amount: <string>
          },
      requested_digital_amount: {
          currency: <string>,
          amount: <string>
          }
    }
    ```

    - The user_id supplied to the status endpoint the same user_id used to generate the order.
    - The status is updated when an event containing the user_id appears.
    - Note: The user_id is created on a per order basis, so no correlation exists between various orders.


#### Debuging

Logging Namespaces:

validation:bypass

request:
routes-order
routes-quote

response:
routes-order
routes-quote

calls:
getOrder
getQuote

## Built With

* [ExpressJS](https://expressjs.com/) - The web framework
* [Mocha](https://mochajs.org/) - The testing framework
* [docker](https://www.docker.com) - Container Platform

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

