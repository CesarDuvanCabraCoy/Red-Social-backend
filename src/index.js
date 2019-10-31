const express = require('express');
const app = express();
const exp = require('express-handlebars');
const path = require('path');
const mo = require('method-override');
const expressSession = require('express-session');

//Settings
app.set('port,process.env.port|| 3000');
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exp({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partials: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//middleware
app.use(express.urlencoded({extend: false}));
app.use(mo('_method'));
app.use(expressSession({
    secret:'mysecretapp',
    resave:true,
    saveUninitialized:true
}));
//Global Variables

//routes
app.use(require('./routes/index'));
app.use(require('./routes/movie'));
app.use(require('./routes/user'));
//static files


//Server listen
app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening on port 3000!');
});