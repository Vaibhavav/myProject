'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
    cron = require('../../app/controllers/cron');
module.exports = function(app) {
    app.get('/api/cron/check/:type', cron.check);
};

