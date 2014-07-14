var path = require('path'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    passport = require('passport'),
    db = require('passport'),
    config = require('./config.js'),
    multer = require('multer'),
    db = require('../model'),
    compression = require('compression'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    routes = require('../routes/index'),
    engine = require('ejs-locals'),
    session = require('express-session');
//shit connect to mongo
module.exports = function(app, express) {
    var expressc = this;
    // view engine setup
    app.engine('ejs', engine);
    app.use(multer({
        dest: './uploads/',
        rename: function(fieldname, filename) {
            return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
        }
    }))
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(favicon());
    app.use(require("connect-assets")());
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    app.use(cookieParser());
    app.use(compression({
        filter: function(req, res) {
            return /json|text|javascript|css/.test(res.getHeader('Content-Type'))
        },
        level: 9
    }))
    app.use(session({
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized: true,
        cookie: {
            domain: config.host + ':' + config.port,
            secure: true
        },
        proxy: false // if you do SSL outside of node.
    }))
    console.log(config.host);
    app.use(express.static(path.join(__dirname, '../../public')));

    app.enable('trust proxy');
    app.disable('x-powered-by');

    var controller = {};
    require("fs").readdirSync("./app/controller").forEach(function(file) {
        file_class = file.substring(0, file.length - 3);
        controller[file_class] = require("../controller/" + file_class);
    });

    routes = require('../routes/index')(express, controller);
    app.use(routes);

    /// catch 404 and forwarding to error handler
    app.use(function(req, res, next) {
        if (res.status == 404) {
            res.render('error/404')
        }
    });

    /// error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });

    db.sequelize
        .sync({
            force: false
        })
        .complete(function(err) {
            if (err) {
                throw err
            } else {
                // console.log(Express server' listening on port ' + app.get('port'))
            }
        })
    return expressc;
}