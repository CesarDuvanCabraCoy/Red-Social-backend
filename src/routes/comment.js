const router = require('express').Router();
let clientCass = require('../database/dbCassandra');
let clientRedis = require('../database/dbRedis');
let session = require("../database/dbNeo4j");
const uuid = require('uuid');
// Models
const Movie = require('../models/Movie');

// Helpers
const {isAuthenticated} = require('../helpers/auth');

router.get('/comments/movie/:id', function (req, res) {
    const query = "select * from movies where id ='" + req.params.id + "'";
    let titulo;
    clientCass.execute(query, [], function (err, result) {
        if (err) {
            console.log('error: ' + err);
        } else {
            let movie = result.rows[0];
            let lista = [];
            titulo = movie.title;
            clientRedis.smembers('' + titulo, function (err, object) {
                object.forEach(function (element) {
                    lista.push({'comentario': '' + element});
                });
                let movies2;
                session.run('match (n) return n').then(function (result) {
                    result.records.forEach(function (record) {
                        if (record._fields[0].properties.titulo === movie.title) {
                            movies2 = {
                                title: movie.title,
                                email: movie.email,
                                id_persona: movie.id_persona,
                                description: movie.description,
                                id: movie.id,
                                imagen: record._fields[0].properties.imagen
                            };
                        }
                    });
                    movie = movies2;
                    res.render('comments/newComment.hbs', {movie, lista});
                }).catch();
            });

        }
    });
});

router.post('/comments/save/:id', async (req, res) => {
    let title = "";
    title = req.params.id;
    let comentario = "";
    comentario = req.body.comentario;
    if (comentario !== "" && comentario.length < 50) {
        const query = "select * from movies";
        let author = "";
        clientCass.execute(query, [], function (err, result) {
            if (err) {
                console.log('error: ' + err);
            } else {
                const movies = result.rows[0];
                movies.forEach(function (element) {
                        if (element.title == title) {
                            author = element.email;
                        }
                    }
                );
            }
        });
        clientRedis.sadd('' + title, '' + comentario);
        res.redirect('/');
    } else {
        res.redirect('/');
    }
});

module.exports = router;