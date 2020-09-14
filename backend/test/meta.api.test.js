const app = require('../server/app');
const request = require('supertest');
const session = require('supertest-session');
const assert = require('assert').strict;

let connectParam = {
    host: '220.86.70.156',
    port: 16804,
    database: 'covid19',
    graph: 'corona_spread',
    user: 'consulting',
    password: 'bitnine123!',
};

describe('Test Connector Api', () => {

    let mappingUrl = '/api/v1/db';

    it('Execute Connect', (done) => {
        request(app)
            .post(`${mappingUrl}/connect`)
            .send(connectParam)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) done(err);
                assert.deepStrictEqual(res.body, connectParam);
                return done();
            });
    });

    it('Execute Wrong Connect', (done) => {
        let wrongParam = {
            host: '220.86.70.156',
            port: 16804,
            database: 'covid19',
            graph: 'corona_spread22',
            user: 'consulting',
            password: 'bitnine123!',
        };
        request(app)
            .post(`${mappingUrl}/connect`)
            .send(wrongParam)
            .expect(500)
            .end((err, res) => {
                if (err) done(err);
                console.log(res.body)
                done();
            });
    });

    describe('Meta Api Test !', () => {
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

    it('Test Get Metadata NotConnected', (done) => {
        request(app)
            .get(`${mappingUrl}/meta`)
            .expect('Content-Type', /json/)
            .expect(500)
            .end((err, res) => {
                if (err) done(err);
                done();
            });
    });

    describe('잘못된 연결 후, 정상 연결 시 잘못된 연결데이터 전달', () => {
        const sessionRequest = session(app);
        let wrongParam = {
            host: '192.168.0.1',
            port: 1432,
            database: 'covid19',
            graph: 'corona_spread',
            user: 'consulting',
            password: 'bitnine123!',
        };
        before(function (done) {
            sessionRequest
                .post(`${mappingUrl}/connect`)
                .send(wrongParam)
                .expect('Content-Type', /json/)
                .expect(500)
                .end((err, res) => {
                    if (err) done(err);
                    console.log(res.body)
                    done();
                });
        });
        it('정상 연결 요청', (done) => {
            sessionRequest
                .post(`${mappingUrl}/connect`)
                .send(connectParam)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) done(err);
                    assert(res.body, connectParam);
                    done();
                });
        });
    });
});
