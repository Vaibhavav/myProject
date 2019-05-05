'use strict';

/**
 * Module dependencies.
 */
var express     = require('express');
var fs          = require('fs');
var httpRequest = require('request');


/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Load Configurations
var config          = require('./config/config');
var winston         = require('./config/winston');

winston.info('Starting '+config.app.name+'...');
winston.info('Config loaded: '+config.NODE_ENV);
winston.debug('Accepted Config:',config);

var db              = require('./config/sequelize');
var passport        = require('./config/passport');

var app = express();

//Initialize Express
require('./config/express')(app, passport);

//Start the app by listening on <port>
app.listen(config.PORT);
winston.info('Express app started on port ' + config.PORT);
var schedule = require('node-schedule');
let cron15 = schedule.scheduleJob('0 */15 * * * *', function(){
    var post = {
        url : 'http://127.0.0.1:3009/api/cron/check/1',
        method : 'GET',
    }
    httpRequest(post, function(err, r, b) {
        console.log('cron15',b);
    });
});
let cronHourly = schedule.scheduleJob('0 0 */1 * * *', function(){
    var post = {
        url : 'http://127.0.0.1:3009/api/cron/check/2',
        method : 'GET',
    }
    httpRequest(post, function(err, r, b) {
        console.log('cronHourly',b);
    });
});
let cronDaily = schedule.scheduleJob('0 0 0 */1 * *', function(){
    var post = {
        url : 'http://127.0.0.1:3009/api/cron/check/3',
        method : 'GET',
    }
    httpRequest(post, function(err, r, b) {
        console.log('cronDaily',b);
    });
});
//expose app
module.exports = app;
