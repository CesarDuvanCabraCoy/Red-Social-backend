const redis = require('redis');
const clientRedis = redis.createClient();

clientRedis.on('connect', function () {
    console.log('DB Connected Redis');
});

module.exports = clientRedis;