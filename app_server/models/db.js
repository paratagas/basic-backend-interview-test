/**
 * DB module
 */

var mongoose = require('mongoose');
var express = require('express');
var app = express();
console.log('env is: ', app.get('env'));
var appSettings = require('../../settings');
var gracefulShutdown;
var dbURI = appSettings.mongo.connectionString;

mongoose.connect(dbURI);

// Connection events
mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected');
});

// Capture app termination / restart events

// To be called when process is restarted or terminated
gracefulShutdown = function(msg, callback) {
    mongoose.connection.close(function() {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};

// For nodemon restarts
process.once('SIGUSR2', function() {
    gracefulShutdown('nodemon restart', function() {
        process.kill(process.pid, 'SIGUSR2');
    });
});

// For app termination
process.on('SIGINT', function() {
    gracefulShutdown('app termination', function() {
        process.exit(0);
    });
});

// Bring in schemas & models
require('./neo');
