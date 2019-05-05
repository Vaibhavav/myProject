'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
    rules = require('../../app/controllers/rules');
module.exports = function(app) {
    app.get('/api/rules/getAll', users.requiresLogin, rules.getAll);
    app.get('/api/rules/getAll/cron/:type', rules.getAll);
    app.post('/api/rules/create', users.requiresLogin, rules.create);
    app.post('/api/rules/delete', users.requiresLogin, rules.delete);
};

