let clientCass = require("C:/Users/Lenovo/Escritorio/Node-ProyectoElectiva/src/database/dbCassandra");

const router = require('express').Router();

router.get('/', function (req, res) {
    res.render('index.hbs');
});

router.get('/about', function (req, res) {
    res.render('about');
});


function exec() {
    const query = "select * from users;";
    clientCass.execute(query, [], function (err, result) {
        if (err) {
            console.log('error' + err);
        } else {
            console.log(result.rows);
        }
    });
}
module.exports = router;