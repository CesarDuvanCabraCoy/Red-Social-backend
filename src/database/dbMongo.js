const mongoose = require('mongoose');

mongoose
    .connect(
        'mongodb://localhost/movies-elect',
        {
            useNewUrlParser: true
        }
    )
    .then(db => console.log('Db Connected Mongo'))
    .catch(err => console.log(err));