const router = require('express').Router();

router.get('/',function(req,res){
    res.send('movie');
});

module.exports = router;