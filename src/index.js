var express = require('express');
var app = express();


const path = require('path');


//Settings
app.set('port,process.env.port|| 3000');
//middleware

//Global Variables

//routes

//static files


//Server listen
app.listen(process.env.PORT || 3000, function() {
    console.log('Example app listening on port 3000!');
});