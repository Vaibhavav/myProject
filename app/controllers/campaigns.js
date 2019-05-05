'use strict';

/**
 * Module dependencies.
 */
var StandardError = require('standard-error');
var db = require('../../config/sequelize'),
    async = require('async');


var campaigns = {
    getMetrics:function (req, res) {
        var rule = {
            order: [['id', 'DESC']],
            where: ['status in (1) ']
        };
        async.auto({
                metricList: function (callback) {
                    db.Metric.findAndCountAll(rule).then(function (metricsModel) {
                        if (metricsModel) {
                            callback(null, metricsModel);
                        }
                        else {
                            callback({status: 0, message: 'Please try again'});
                        }
                    }).catch(function (err) {
                            callback({status: 0, message: 'Please try again', error: err});
                        }
                    );

                }
            },
            function (err, result) {
                if (err) {

                    res.send(err);

                }
                else if (result) {
                    var data = {
                        status: 1,
                        message: '',
                        totalMetrics: result.metricList.count,
                        metricList: result.metricList.rows
                    };
                    // console.log('11111111111111',data);

                    res.send(data);

                }
            }
        );
    },
    getCampaigns:function (req, res) {
        var rule = {
            order: [['id', 'DESC']],
            where: ['status in (1) ']
        };
        async.auto({
                campaignList: function (callback) {
                    db.Campaign.findAndCountAll(rule).then(function (CampaignsModel) {
                        if (CampaignsModel) {
                            callback(null, CampaignsModel);
                        }
                        else {
                            callback({status: 0, message: 'Please try again'});
                        }
                    }).catch(function (err) {
                            callback({status: 0, message: 'Please try again', error: err});
                        }
                    );

                }
            },
            function (err, result) {
                if (err) {

                    res.send(err);

                }
                else if (result) {
                    var data = {
                        status: 1,
                        message: '',
                        total: result.campaignList.count,
                        campaignList: result.campaignList.rows
                    };
                    // console.log('11111111111111',data);

                    res.send(data);

                }
            }
        );
    }
};

module.exports = campaigns;