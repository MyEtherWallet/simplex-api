import app from '../src'
import chai from 'chai'
import request from 'supertest'

var expect = chai.expect

describe('API Info Test', function() {
    it('should return version number', function(done) {
        var packageInfo = require('../package.json')
        request(app)
            .post('/quote')
            .send({
                'digital_currency': 'ETH',
                'fiat_currency': 'USD',
                'requested_currency': 'ETH',
                'requested_amount': 0.8
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end(function(err, res) {
                console.log(res.body)
                done();
            })
    })
})