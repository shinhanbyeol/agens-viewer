const app = require('../server/app');
const session = require('supertest-session');
const assert = require('assert').strict;

const request = session(app);

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
        request
            .post(`${mappingUrl}/connect`)
            .send(connectParam)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                assert.deepStrictEqual(res.body.data, connectParam);
                return done();
            });
    });

    it('CheckStatus API', (done) => {
        request
            .get(`${mappingUrl}/`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                assert.deepStrictEqual(res.body.data, connectParam);
                return done();
            });
    });

    describe('DatabaseMetadata Api Test !', () => {
        beforeEach(function (done) {
            request
                .post(`${mappingUrl}/connect`)
                .send(connectParam)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;
                    assert(res.body.data, connectParam);
                    return done();
                });
        });
        it('Retrieve Meta', (done) => {
            request
                .get(`${mappingUrl}/meta`)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    console.log(res.body)
                    if (err) throw err;
                    return done();
                });
        });
    });
});
