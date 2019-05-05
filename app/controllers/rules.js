'use strict';

/**
 * Module dependencies.
 */
var StandardError = require('standard-error');
var db = require('../../config/sequelize'),
    async = require('async'),
    httpRequest = require('request');


var rules = {
    getAll:function (req, res) {
        var type = req.params.type || null;
        var rule = {
            order: [['id', 'DESC']],
            where: ['status in (1,0) ']
        };
        if(type){
            rule.where = ['status in (1,0) AND schedule = '+ type];
        }
        async.auto({
                rulesList: function (callback) {
                    db.Rules.findAndCountAll(rule).then(function (rulesModel) {
                        if (rulesModel) {
                            callback(null, rulesModel);
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
                        totalRules: result.rulesList.count,
                        rulesList: result.rulesList.rows
                    };

                    res.send(data);

                }
            }
        );
    },
    create:function (req, res) {
        let body = req.body;
        async.auto({
                ruleFetch: function (callback) {
                    if(body.id==='new'){
                        return callback(null);
                    }
                    db.Rules.find({
                        where: {id: body.id},
                    }).then(function (ruleModel) {
                            if (ruleModel) {
                                callback(null, ruleModel);
                            } else {
                                callback(null);
                            }
                        }, function (err) {
                            callback(null);
                        }
                    );

                },
                ruleCreate: ['ruleFetch',function (result,callback) {
                    var Rules;
                    if(result.ruleFetch){
                        Rules = result.ruleFetch;
                        Rules.name = body.name;
                        Rules.status = body.status;
                        Rules.action = body.action;
                        Rules.schedule = body.schedule;
                        Rules.condition = JSON.stringify(body.condition);
                        Rules.campaign_id = body.campaign_id;
                    }
                    else {
                        var ruleObj = {
                            name: body.name,
                            status: body.status,
                            action: body.action,
                            schedule: body.schedule,
                            condition: JSON.stringify(body.condition),
                            campaign_id: body.campaign_id,
                        };
                        Rules = db.Rules.build(ruleObj);
                    }
                    Rules.save().then(function (result) {
                        if (result) {
                            callback(null, result);
                        }
                        else {
                            callback({status: 0, message: 'Not Added'});
                        }
                    }, function (err) {
                        callback({status: 0, message: 'Please try again', error: err});
                    });

                }]
            },
            function (err, result) {
                if (err) {

                    res.send(err);

                }
                else if (result) {
                    var data = {status: 1, message: 'Rule added', rule: result.ruleCreate};

                    res.send(data);

                }
            }
        );

    },
    delete:function (req, res) {
        let id = req.body.id;
        async.auto({
            ruleFetch: function (callback) {
                db.Rules.find({
                    where: {id: id},
                }).then(function (studyModel) {
                        if (studyModel) {
                            callback(null, studyModel);
                        } else {
                            callback({status: 0, message: 'Study Not Found'});
                        }
                    }, function (err) {
                        callback({
                            status: 0,
                            message: 'Please try again',
                            error: err
                        });
                    }
                );

            },
            ruleUpdate: ["ruleFetch", function (result, callback) {

                var rule = result.ruleFetch;
                rule.status = '-1';

                // update orgID only in scenario where request found
                rule.save().then(function (result) {
                    if (result) {
                        callback(null, 'updated');
                    } else {
                        callback({status: 0, message: 'Not Updated'});
                    }
                }, function (err) {
                    callback({
                        status: 0,
                        message: 'Please try again',
                        error: err
                    });
                });

            }],
            function(err, result) {
                if (err) {

                    res.send(err);

                } else if (result) {
                    var data = {
                        status: 1,
                        message: 'Rule Updated',
                        rule: result.ruleUpdate
                    };

                    res.send(data);

                }
            }
        });
    }
};

module.exports = rules;