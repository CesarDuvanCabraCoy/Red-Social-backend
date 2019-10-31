const router = require('express').Router();

router.get('/user/singin',function(req,res){
    res.send('entrando');
});

router.get('/user/singup',function(req,res){
    res.send('formulario');
});

module.exports = router;