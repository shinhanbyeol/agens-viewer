let ag = require('agensgraph');

describe('AgensGraph Driver Test', () => {
    it('Execute Match API', async () => {
        let connectionInfo = {
            host: '192.168.0.68',
            port: 15432,
            database: 'covid19',
            graph: 'corona_spread',
            user: 'consulting',
            password: 'bitnine123!',
        };

        let cmd = "CREATE (a:person {id: 'TEST'}) RETURN a";

        const client = new ag.Client(connectionInfo);
        client.connect();
        client.query(`set graph_path=${connectionInfo.graph}`);
        let result = await client.query(cmd);
        await client.end();

        console.log(result)
    });
});


function convertEdge({ label, id, start, end, props }) {
    return {
        label: label,
        id: `${id.oid}.${id.id}`,
        start: `${start.oid}.${start.id}`,
        end: `${end.oid}.${end.id}`,
        properties: props,
    };
}

function convertVertex({ label, id, props }) {
    return {
        label: label,
        id: `${id.oid}.${id.id}`,
        properties: props,
    };
}
