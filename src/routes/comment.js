const router = require('express').Router();
let clientCass = require('../database/dbCassandra');
let clientRedis = require('../database/dbRedis');
const uuid = require('uuid');
// Models
const Movie = require('../models/Movie');

// Helpers
const {isAuthenticated} = require('../helpers/auth');

router.get('/comments/movie/:id', function (req, res) {
    const query = "select * from movies where id ='" + req.params.id + "'";
    clientCass.execute(query, [], function (err, result) {
        if (err) {
            console.log('error: ' + err);
        } else {
            const movie = result.rows[0];
            let lista = [];
            clientRedis.smembers('' + movie.title, function (err, object) {
                object.forEach(function (element) {
                    lista.push({'comentario': '' + element});
                });
                res.render('comments/newComment.hbs', {movie, lista});
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
        /*
        let lista = [];
        clientRedis.smembers('' + title, function (err, object) {
            object.forEach(function (element) {
                lista.push({'comentario': '' + element});
            });
        });

       // clientRedis.sadd('' + title + ':' + lista.length + ':author', author);

         */
        res.redirect('/');
    } else {
        res.redirect('/');
    }
});

module.exports = router;