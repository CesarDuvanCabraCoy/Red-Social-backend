const router = require('express').Router();

router.get('/user/singin', (req, res) => {
    res.render('users/singin');
});

router.get('/user/singup', (req, res) => {
    res.render('users/singup');
});

module.exports = router;