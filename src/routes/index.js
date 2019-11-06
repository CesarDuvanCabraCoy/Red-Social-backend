const router = require('express').Router();

router.get('/',function(req,res){
    res.render('index.hbs');
});

router.get('/about', function (req, res) {
    res.render('about');
});
module.exports = router;