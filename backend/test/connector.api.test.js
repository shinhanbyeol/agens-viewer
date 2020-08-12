const app = require('../server/app');
const request = require('supertest')
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

describe('Connector Api Test !', () => {
    let mappingUrl = '/api/v1/db';

    it('Connect API', (done) => {
        request(app)
            .post(`${mappingUrl}/connect`)
            .send(connectParam)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                assert.deepStrictEqual(res.body, connectParam);
                return done();
            });
    });

    it('Check status if disconnected', () => {
        request(app)
            .get(`${mappingUrl}/`)
            .expect('Content-Type', /json/)
            .expect(500)
            .end((err, res) => {
                assert(res.body == null)
            });
    });

    describe('CheckStatus Api Test !', () => {
        const sessionRequest = session(app);
        beforeEach(function (done) {
            sessionRequest
                .post(`${mappingUrl}/connect`)
                .send(connectParam)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;
                    assert(res.body, connectParam);
                    return done();
                });
        });
        it('CheckStatus API', (done) => {
            sessionRequest
                .get(`${mappingUrl}/`)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    assert.deepStrictEqual(res.body, connectParam);
                    return done();
                });
        });
    });


    describe('DatabaseMetadata Api Test !', () => {
        const sessionRequest = session(app);
        beforeEach(function (done) {
            sessionRequest
                .post(`${mappingUrl}/connect`)
                .send(connectParam)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;
                    assert(res.body, connectParam);
                    return done();
                });
        });
        it('Retrieve Meta', (done) => {
            sessionRequest
                .get(`${mappingUrl}/meta`)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;
                    assert(!!res.body)
                    return done();
                });
        });
    });
});
