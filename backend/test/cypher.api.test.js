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

let queryParam = {
    cmd: 'MATCH(a:person)-[e] ->(b) return a, e, b limit 10',
};

describe('Cypher Api Test', () => {
    let dbUrl = '/api/v1/db';
    let cypherUrl = '/api/v1/cypher';

    beforeEach(function (done) {
        request
            .post(`${dbUrl}/connect`)
            .send(connectParam)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                assert(res.body.data, connectParam);
                return done();
            });
    });

    it('Execute Match API', (done) => {
        request
            .post(`${cypherUrl}/`)
            .send(queryParam)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                console.log(res.body);
                assert(res.body.data.rows.length == 10);
                assert(res.body.data.columns.length == 3);
                done();
            });
    });
});
