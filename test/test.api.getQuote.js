import app from '../src'
import chai from 'chai'
import request from 'supertest'
import {
    simplex
} from '../src/config'
import uuidv4 from 'uuid/v4'
const assert = chai.assert
const testAddress = {
    BTC: '1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9',
    ETH: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
}
describe('API getQuote Test', () => {
    let quoteResponse = {}
    it('should return quote info', (done) => {
        const packageInfo = require('../package.json')
        const _digital = simplex.validDigital[Math.floor(Math.random() * simplex.validDigital.length)]
        const _fiat = simplex.validFiat[Math.floor(Math.random() * simplex.validFiat.length)]
        const _amount = Math.floor(Math.random() * 3) + 1
        request(app)
            .post('/quote')
            .send({
                'digital_currency': _digital,
                'fiat_currency': _fiat,
                'requested_currency': _digital,
                'requested_amount': _amount
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                let body = res.body
                assert.typeOf(body, 'Object')
                assert.equal(body.error, false)
                let response = body.msg
                assert.typeOf(response.user_id, 'string')
                assert.typeOf(response.quote_id, 'string')
                assert.equal(response.wallet_id, simplex.walletID)
                assert.equal(response.digital_money.amount, _amount)
                assert.equal(response.digital_money.currency, _digital)
                assert.equal(response.fiat_money.currency, _fiat)
                quoteResponse = response
                done();
            })
    }).timeout(5000)

    it('should initiate an order', (done) => {
        console.log(quoteResponse)
        let reqObject = {
            account_details: {
                app_end_user_id: quoteResponse.user_id,
                signup_login: {
                    uaid: quoteResponse.user_id,
                    accept_language: "de,en-US;q=0.7,en;q=0.3",
                    http_accept_language: "de,en-US;q=0.7,en;q=0.3",
                    user_agent: "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:45.0) Gecko/20100101 Firefox/45.0",
                    cookie_session_id: quoteResponse.user_id
                }
            },
            transaction_details: {
                payment_details: {
                    quote_id: quoteResponse.quote_id,
                    payment_id: uuidv4(),
                    order_id: uuidv4(),
                    fiat_total_amount: {
                        currency: quoteResponse.fiat_money.currency,
                        amount: quoteResponse.fiat_money.base_amount
                    },
                    requested_digital_amount: {
                        currency: quoteResponse.digital_money.currency,
                        amount: quoteResponse.digital_money.amount
                    },
                    destination_wallet: {
                        currency: quoteResponse.digital_money.currency,
                        address: testAddress[quoteResponse.digital_money.currency]
                    }
                }
            }
        }
        request(app)
            .post('/order')
            .send(reqObject)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                //let body = res
                // console.log(reqObject)
                console.log(res.body)
                    //console.log(body)
                done();
            })
    }).timeout(5000)
})