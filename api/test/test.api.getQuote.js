import app from '../src'
import chai from 'chai'
import request from 'supertest'
import {
    simplex
} from '../src/config'
import uuidv4 from 'uuid/v4'
const assert = chai.assert
const expect = chai.expect
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
        const _pair = [_digital, _fiat]
        const _requested = _pair[Math.floor(Math.random() * _pair.length)]
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
                let response = body.result
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
        let reqObject = {
            account_details: {
                app_end_user_id: quoteResponse.user_id,
            },
            transaction_details: {
                payment_details: {
                    fiat_total_amount: {
                        currency: quoteResponse.fiat_money.currency,
                        amount: quoteResponse.fiat_money.total_amount
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
                let body = res.body
                assert.equal(body.error, false)
                let result = body.result
                assert.equal(result.version, simplex.apiVersion)
                assert.equal(result.destination_wallet_address, testAddress[quoteResponse.digital_money.currency])
                assert.equal(result.destination_wallet_currency, quoteResponse.digital_money.currency)
                assert.equal(result.fiat_total_amount_amount, quoteResponse.fiat_money.total_amount)
                assert.equal(result.fiat_total_amount_currency, quoteResponse.fiat_money.currency)
                assert.equal(result.digital_total_amount_amount, quoteResponse.digital_money.amount)
                assert.equal(result.digital_total_amount_currency, quoteResponse.digital_money.currency)
                assert.equal(result.payment_post_url, simplex.paymentEP.replace(/\u200B/g,''))
                done();
            })
    }).timeout(5000)

    it('should attempt to get invalid quote info ', (done) => {
        const packageInfo = require('../package.json')
        const _digital = simplex.validDigital[Math.floor(Math.random() * simplex.validDigital.length)]
        const _fiat = simplex.validFiat[Math.floor(Math.random() * simplex.validFiat.length)]
        const _pair = [_digital, _fiat]
        const _requested = _pair[Math.floor(Math.random() * _pair.length)]
        const _amount = 200
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
                let response = body.result
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

    it('should try to initiate an invalid order', (done) => {
        let reqObject = {
            account_details: {
                app_end_user_id: quoteResponse.user_id,
            },
            transaction_details: {
                payment_details: {
                    fiat_total_amount: {
                        currency: quoteResponse.fiat_money.currency,
                        amount: quoteResponse.fiat_money.total_amount
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
                let body = res.body
                assert.equal(body.error, false)
                let result = body.result
                assert.equal(result.version, simplex.apiVersion)
                assert.equal(result.destination_wallet_address, testAddress[quoteResponse.digital_money.currency])
                assert.equal(result.destination_wallet_currency, quoteResponse.digital_money.currency)
                assert.equal(result.fiat_total_amount_amount, quoteResponse.fiat_money.total_amount)
                assert.equal(result.fiat_total_amount_currency, quoteResponse.fiat_money.currency)
                assert.equal(result.digital_total_amount_amount, quoteResponse.digital_money.amount)
                assert.equal(result.digital_total_amount_currency, quoteResponse.digital_money.currency)
                done();
            })
    }).timeout(5000)
})