"use strict";
var StandardError = require('standard-error');
var db = require('../../config/sequelize'),
    async = require('async'),
    httpRequest = require('request'),
    nodemailer = require('nodemailer'),
    email = require("../../config/env/email");

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email.email,
        pass: email.password
    }
});

var cron ={
    check:function (req,res) {
        var type = req.params.type;//1-every15Min, 2- everyHour, 3- everyDay
        async.auto({
            getAllRules:function (callback) {
                var post = {
                    url : 'http://127.0.0.1:3009/api/rules/getAll/cron/'+type,
                    method : 'GET',
                }
                httpRequest(post, function(err, r, b) {
                    b = JSON.parse(b);
                    callback(null,b);
                });
            },
            getAllCampaigns:function(cb){
                var post = {
                    url : 'http://127.0.0.1:3009/api/campaigns/getAll/cron',
                    method : 'GET',
                }
                httpRequest(post, function(err, r, b) {
                    b = JSON.parse(b);
                    cb(null,b);
                });
            },
            getMetricsForEachRule:['getAllRules','getAllCampaigns',function(result,callback){
                let rules = result.getAllRules.rulesList;
                let campaigns = result.getAllCampaigns.campaignList;
                async.forEach(rules,function(rule,cb){
                        async.forEach(JSON.parse(rule.campaign_id),function(campaign,iCb){
                            Helper.computeRule(campaign,JSON.parse(rule.condition),rule,campaigns.find(o => o.id ==campaign).name,iCb);
                        },function (ierr) {
                            cb(ierr);
                        });
                    },
                    function (err) {
                        callback(err);
                });
            }]
        },function (err, result) {
            if (err) {

                res.send(err);

            }
            else if (result) {
                var data = {
                    status: 1,
                    message: '',
                    result:'Done'
                };

                res.send(data);

            }
        });
    }
};

var Helper = {
    computeRule: function (campaign,condition,rule,campaignName,callback) {
        var operations={"1":" >= ","2":" <= ","3":" == "};
        var operator={"1":" && ","2":" || "};
        async.auto({
            getMetrics:function (cb) {
                var q = "SELECT metric_id,sum(`value`) as value FROM `CampaignData` where campaign_id = ? GROUP BY metric_id";
                db.sequelize.query(q, {
                    replacements: [campaign],
                    type: db.sequelize.QueryTypes.SELECT
                }).then(function (metricData) {
                    cb(null,metricData);
                },function(error){
                    cb(error);
                });
            },
            parseCondition:['getMetrics',function (result,cb) {
                let metricData = result.getMetrics;
                let finalRes = false;
                async.forEachSeries(condition,function (cond,innerCb) {
                    let data = metricData.find(o => o.metric_id === cond.metric);
                    let val = data && data.value || 0;
                    finalRes = eval(finalRes + (operator[cond.operator]||' || ') + val + operations[cond.operation] + cond.value);
                    innerCb(null);
                },function (err) {
                    cb(err,finalRes);
                });
            }],
            performAction:['parseCondition',function (result,cb) {
                let finalRes = result.parseCondition;
                if(!finalRes){
                    return cb(null);
                }
                if(rule.action ==='Notify'){
                    var mailOptions = {
                        from: 'aishwaryavaibhav@gmail.com',
                        to: 'aishwarya.vaibhav@crownit.in',
                        subject: 'Condition fulfilled for '+rule.name,
                        text: 'Condition is fulfilled for campaign '+campaignName+', please take the necessary actions.'
                    };
                    console.log('finalRes',finalRes,rule.name);
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                            cb(null);
                        } else {
                            console.log('Email sent: ' + info.response);
                            cb(null);
                        }
                    });
                    cb(null);
                }
            }]
        },function (err,result) {
            callback(null);
        });
    }
}

module.exports=cron;