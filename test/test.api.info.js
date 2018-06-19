import app from '../src'
import chai from 'chai'
import request from 'supertest'

var expect = chai.expect

describe('API Info Test', function() {
    it('should return version number', function(done) {
        var packageInfo = require('../package.json')
        request(app)
            .get('/info')
            .end(function(err, res) {
                expect(res.body.error).to.equal(false)
                expect(res.body.msg.version).to.equal(packageInfo.version)
                expect(res.statusCode).to.equal(200)
                done();
            })
    })
})