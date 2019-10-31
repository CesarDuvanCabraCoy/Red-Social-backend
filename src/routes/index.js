const router = require('express').Router();

router.get('/',function(req,res){
    res.send('Inicio');
});

module.exports = router;