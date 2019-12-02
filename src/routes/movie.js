const express = require('express');
const router = express.Router();
let clientCass = require('../database/dbCassandra');
const uuid = require('uuid');
// Models
const Movie = require('../models/Movie');

// Helpers
const {isAuthenticated} = require('../helpers/auth');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/uploads'),
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const uploadImage = multer({
    storage,
    limits: {fileSize: 1000000}
}).single('image');

// Nueva pelicula
router.get('/movies/add', isAuthenticated, (req, res) => {
    res.render('movies/newMovie');
});

//agregando en la db
router.post('/movies/newMovie', isAuthenticated, async (req, res) => {
    uploadImage(req, res, (err) => {
        if (err) {
            err.message = 'The file is so heavy for my service';
            return res.send(err);
        }
        console.log(req.file);
        const {title, description} = req.body;
        const errors = [];
        if (!title) {
            errors.push({text: 'Please Write a Title.'});
        }
        if (!description) {
            errors.push({text: 'Please Write a Description'});
        }
        if (errors.length > 0) {
            res.render('movies/newMovie', {
                errors,
                title,
                description
            });
        } else {
            const query = "INSERT INTO movies (id, id_persona, title, description, email) VALUES ('" + uuid() + "','" + req.user.id + "','" + title + "', '" + description + "','" + req.user.email + "');";
            clientCass.execute(query, [], function (err, result) {
                if (err) {
                    console.log('error' + err);
                } else {
                    req.flash('success_msg', 'Movie Added Successfully');
                    res.redirect('/movies/myMovie');
                }
            });
        }
    });
});

// Get All movies
router.get('/movies', isAuthenticated, async (req, res) => {
    res.render('movies/allMovies');
});
//get all my movies
router.get('/movies/myMovie', isAuthenticated, async (req, res) => {
    const query = "Select * from movies";
    const movies = [];
    clientCass.execute(query, [], function (err, result) {
        if (err) {
            console.log('error: ' + err);
        } else {
            const mymovie = result.rows;
            mymovie.forEach(function (element) {
                if (element.id_persona == req.user.id) {
                    movies.push(element);
                }
            });
            res.render('movies/allMovies', {movies});
        }
    });
});
// Edit movie
router.get('/movies/edit/:id', isAuthenticated, async (req, res) => {
    const query = "select * from movies where id ='" + req.params.id + "'";
    clientCass.execute(query, [], function (err, result) {
        if (err) {
            console.log('error: ' + err);
        } else {
            const movie = result.rows[0];
            res.render('movies/editMovie', {movie});
            if (movie.id_persona != req.user.id) {
                req.flash('error_msg', 'Not Authorized');
                return res.redirect('/movies/myMovie');
            }
        }
    });
});
//actualiza en db
router.put('/movies/editMovie/:id', isAuthenticated, async (req, res) => {
    const {title, description} = req.body;
    const query = " UPDATE movies SET title = '" + title + "', description = '" + description + "' WHERE  id='" + req.params.id + "'";
    clientCass.execute(query, [], function (err, result) {
        if (err) {
            console.log('error: ' + err);
        } else {
            req.flash('success_msg', 'Movie Updated Successfully');
            res.redirect('/movies/myMovie');
        }
    });
});

// Delete movie
router.delete('/movies/delete/:id', isAuthenticated, async (req, res) => {
    const query = "delete from movies where id='" + req.params.id + "'";
    clientCass.execute(query, [], function (err, result) {
        if (err) {
            console.log('error: ' + err);
        } else {
            req.flash('success_msg', 'Movie Deleted Successfully');
            res.redirect('/movies/myMovie');
        }
    });
});

module.exports = router;