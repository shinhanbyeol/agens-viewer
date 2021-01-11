const app = require('../app');
const request = require('supertest');
const session = require('supertest-session');
const assert = require('assert').strict;

let connectParam = {
    host: '192.168.0.68',
    port: 15432,
    database: 'covid19',
    graph: 'corona_spread',
    user: 'consulting',
    password: 'bitnine123!',
};

let outsideConnectParam = {
    host: '220.86.70.156',
    port: 16804,
    database: 'covid19',
    graph: 'corona_spread',
    user: 'consulting',
    password: 'bitnine123!',
};

describe('MetaAPI Test', () => {

    let mappingUrl = '/api/v1/db';

    describe('Execute Meta', () => {
        const sessionRequest = session(app);
        before(function (done) {
            sessionRequest
                .post(`${mappingUrl}/connect`)
                .send(connectParam)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) done(err);
                    assert(res.body, connectParam);
                    return done();
                });
        });
        it('Get Metachart', (done) => {
            sessionRequest
                .get(`${mappingUrl}/metaChart`)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) done(err);
                    console.log(res.body);
                    assert(!!res.body);
                    done();
                });
        });
    });

});
