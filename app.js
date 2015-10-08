var port                = '9000';

var express             = require('express');
var app                 = express();
var path                = require('path');
var hogan               = require('hogan-express');
var cookieParser        = require('cookie-parser');
var session             = require('express-session');
var config              = require('./config/config.js');
var ConnectMongo        = require('connect-mongo')(session);
var mongoose            = require('mongoose').connect(config.dbUrl);
var passport            = require('passport');
var FacebookStrategy    = require('passport-facebook').Strategy;

app.set('views', path.join(__dirname, 'views'));
app.engine('html', hogan);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

var env = process.env.NODE_ENV || 'development';

if(env === 'development'){
    app.use(session({secret:config.sessionSecret}));
} else {
    app.use(session({
        secret:config.sessionSecret,
        store: new ConnectMongo({
            // url:config.dbUrl,
            mongoose_connection:mongoose.connections[0],
            stringyfy:true
        })
    }));
}

app.use(passport.initialize());
app.use(passport.session());

require('./routes/routes')(express, app, passport);
require('./auth/passportAuth')(passport, FacebookStrategy, config, mongoose);

app.listen(port, function(){
    console.log('listening on port: ' + 9000);
    console.log('mode: ' + env)
})
