'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
    campaigns = require('../../app/controllers/campaigns');
module.exports = function(app) {
    app.get('/api/metrics/getAll', users.requiresLogin, campaigns.getMetrics);
    app.get('/api/campaigns/getAll', users.requiresLogin, campaigns.getCampaigns);
    app.get('/api/campaigns/getAll/cron', campaigns.getCampaigns);
};

