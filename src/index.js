const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const mo = require('method-override');
const expressSession = require('express-session');
const flash = require('connect-flash');
const morgan = require('morgan');

//inicilizacion
const app = express();
require('./database/dbMongo');
require('./database/dbRedis');
require('./database/dbCassandra');

//Settings
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
app.set('port,process.env.port|| 3000');
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
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
app.use(flash());
app.use(morgan('dev'));
//Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});
//routes
app.use(require('./routes/index'));
app.use(require('./routes/movie'));
app.use(require('./routes/users'));
//static files


//Server listen
app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening on port 3000!');
});