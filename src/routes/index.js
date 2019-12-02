let clientCass = require("../database/dbCassandra");
let session = require("../database/dbNeo4j");
const router = require('express').Router();

router.get('/', function (req, res) {
    const query = "Select * from movies";
    let movies = [];
    let images = [];
    clientCass.execute(query, [], function (err, result) {
        if (err) {
            console.log('error: ' + err);
        } else {
            movies = result.rows;
            session.run('match (n) return n').then(function (result) {
                result.records.forEach(function (record) {
                    if (record._fields[0].properties.titulo != undefined) {
                        let obj = {
                            "titulo": record._fields[0].properties.titulo,
                            "imagen": record._fields[0].properties.imagen
                        };
                        images.push(obj);
                    }
                });
            }).catch();
            res.render('index.hbs', {movies, images});
        }
    });
});

router.get('/about', function (req, res) {
    res.render('about');
});

module.exports = router;