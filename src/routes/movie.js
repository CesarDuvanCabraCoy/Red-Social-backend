const router = require('express').Router();

router.get('/movies',function(req,res){
    res.send('movie');
});

module.exports = router;