const redis = require('redis');
const client = redis.createClient();

client.on('connect', function () {
    console.log('DB Connected Redis');

});

module.exports = client;