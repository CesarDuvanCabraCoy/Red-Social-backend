const express = require('express');
const router = express.Router();
let clientCass = require('../database/dbCassandra');
const uuid = require('uuid');
// Models
const Movie = require('../models/Movie');

// Helpers
const {isAuthenticated} = require('../helpers/auth');

// New Movie
router.get('/movies/add', isAuthenticated, (req, res) => {
    res.render('movies/newMovie');
});

router.post('/movies/newMovie', isAuthenticated, async (req, res) => {
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
                console.log('Se guardo correctamente! Cassandra');
                req.flash('success_msg', 'Movie Added Successfully');
                res.redirect('/movies/myMovie');
            }
        });
    }
});

// Get All Notes
router.get('/movies', isAuthenticated, async (req, res) => {
    res.render('movies/allMovies');
});

router.get('/movies/myMovie', isAuthenticated, async (req, res) => {
    const query = "Select * from movies";
    clientCass.execute(query, [], function (err, result) {
        if (err) {
            console.log('error: ' + err);
        } else {
            console.log(result.rows);
            const movies = result.rows;
            movies.forEach(function (element) {
                if (element.email) {
                    console.log(element.email);
                }
            });

            // res.render('movies/allMovies', {movies});
        }
    });
    res.render('movies/allMovies');
});
// Edit Notes
router.get('/movies/edit/:id', isAuthenticated, async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (movie.user != req.user.id) {
        req.flash('error_msg', 'Not Authorized');
        return res.redirect('/notes');
    }
    res.render('movies/edit-note', {movie});
});

router.put('/movies/edit-note/:id', isAuthenticated, async (req, res) => {
    const {title, description} = req.body;
    await Movie.findByIdAndUpdate(req.params.id, {title, description});
    req.flash('success_msg', 'Movie Updated Successfully');
    res.redirect('/notes');
});

// Delete Notes
router.delete('/movie/delete/:id', isAuthenticated, async (req, res) => {
    await Movie.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Movie Deleted Successfully');
    res.redirect('/notes');
});

module.exports = router;