const cassandra = require('cassandra-driver');
const clientCass = new cassandra.Client({
    contactPoints: ['127.0.0.1'],
    localDataCenter: 'datacenter1',
    keyspace: "geeky"
});

clientCass.connect(function (err, result) {
    console.log('DB Connected Cassandra');
});

module.exports = clientCass;
/**/