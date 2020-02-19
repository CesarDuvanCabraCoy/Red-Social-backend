let clientCass = require("../database/dbCassandra");
let session = require("../database/dbNeo4j");
const router = require('express').Router();

router.get('/', function (req, res) {
    const query = "Select * from movies";
    let movies = [];
    let movies2 = [];
    clientCass.execute(query, [], function (err, result) {
        if (err) {
            console.log('error: ' + err);
        } else {
            movies = result.rows;
            session.run('match (n) return n').then(function (result) {
                result.records.forEach(function (record) {
                    if (record._fields[0].properties.titulo != undefined) {
                        movies.forEach(function (element) {
                            if (record._fields[0].properties.titulo === element.title) {
                                movies2.push({
                                    title: element.title,
                                    email: element.email,
                                    id_persona: element.id_persona,
                                    description: element.description,
                                    id: element.id,
                                    imagen: record._fields[0].properties.imagen
                                })
                            }
                        });
                    }
                });
                movies = movies2;
                res.render('index.hbs', {movies});
                console.log(movies);
            }).catch();
        }
    });
});

router.get('/about', function (req, res) {
    res.render('about');
});

module.exports = router;