/**
 * Main app logic
 */

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('./app_server/models/db');

var routes = require('./app_server/routes/index');
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/', routes);

/**
 * 404 status handler
 *
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
app.use(function(req, res, next) {
    res.json({"page": "not found"});
});

/**
 * 500 status handler
 * In development mode will print stacktrace
 *
 * @param {object} err
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

/**
 * 500 status handler
 * In production mode no stacktraces leaked to user
 *
 * @param {object} err
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
