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

let dbUrl = '/api/v1/db';
let cypherUrl = '/api/v1/cypher';

let matchQuery = {cmd: "MATCH(p:person) WHERE p.id = 'TEST' RETURN count(p)"};
let createQuery = {cmd: "CREATE(p:person {id: 'TEST'})"};
let deleteQuery = {cmd: "MATCH(p:person) WHERE p.id = 'TEST' DELETE p"};
let setQuery = {cmd: ""};

describe('Cypher DML Test', () => {

    beforeEach(connectDatabase);

    describe('Cypher Create Test', () => {
        afterEach('Check create data', executeMatchQuery);

        it('Execute Create', (done) => {
            request
                .post(`${cypherUrl}/`)
                .send(createQuery)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        done(err);
                    }
                    done();
                });
        });
    })

    describe('Cypher Create Test', () => {
        beforeEach('Check exist data', executeMatchQuery);

        it('Execute Delete', (done) => {
            request
                .post(`${cypherUrl}/`)
                .send(deleteQuery)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        done(err);
                    }
                    done();
                });
        });

        afterEach('Check delete data', executeMatchQuery);
    })

});

function connectDatabase(done)  {
    request
        .post(`${dbUrl}/connect`)
        .send(connectParam)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            if (err) throw err;
            assert(res.body, connectParam);
            return done();
        });
}

function executeMatchQuery(done) {
    request
        .post(`${cypherUrl}/`)
        .send(matchQuery)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            done();
        });
}