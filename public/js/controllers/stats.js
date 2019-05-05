"use strict";
angular.module('mean').controller('statsController', ['$scope', '$stateParams', 'Global', 'Articles', '$state','$cookieStore', 'SignOut','$rootScope','$http',function ($scope, $stateParams, Global, Articles, $state, $cookieStore, SignOut, $rootScope,$http) {
    // $scope.global = Global;
    // $state.go("/");
    $scope.showLoader = true;
    $scope.userName = $cookieStore.get('name');
    $scope.newRule = false;
    $scope.initRule = {"id":"new","ruleName":"","schedule":"Every 15 Min","condition":"","action":"Notify","status":"1"};
    if(!$scope.userName){
        $cookieStore.remove('name');
        $cookieStore.remove('email');
        $scope.global = null;
        $state.go('SignIn');
    }
    $scope.isCollapsed = false;

    $scope.createRule = function (callType,rule) {
        if(callType === 'show'){
            $scope.rule = rule;
            $scope.newRule = true;
        }
        else if (callType === 'hide'){
            $scope.newRule = false;
        }
    };
    $scope.addNewRule = function (model) {
        $scope.showLoader = true;
        alert(JSON.stringify(model));
        $http({
            method: 'POST',
            url: '/api/rules/create',
            data:model,
        }).then(function(data, status, headers, config) {
            $scope.showLoader = false;
            $scope.getAllRules();
            $scope.createRule('hide');
            $scope.showLoader = false;

        }, function(data, status, headers, config) {
            $scope.commonPopupMsg = 'Something went wrong. Please try again.';
            $scope.showCommPopup = true;
            $scope.showLoader = false;
        });
    };
    $scope.ruleEdit = function (model) {
        delete model.$$hashKey;
        model.campaign_id = JSON.parse(model.campaign_id);
        alert(JSON.stringify(model));
        $scope.createRule('show',model);
    };
    $scope.ruleDelete = function (id) {
        if(confirm('Are you sure?')) {
            $scope.showLoader = true;
            $http({
                method: 'POST',
                url: '/api/rules/delete',
                data: {"id": id},
            }).then(function (data, status, headers, config) {
                $scope.getAllRules();
            }, function (data, status, headers, config) {
                $scope.commonPopupMsg = 'Something went wrong. Please try again.';
                $scope.showCommPopup = true;
                $scope.showLoader = false;
            });
        }
    };
/*
    $scope.allRules= [
        {"id":1,"ruleName":"ab","schedule":"Every 15 Min","condition":"qwerty","action":"Notify","status":"active"},
        {"id":2,"ruleName":"as","schedule":"Every Hour","condition":"qw","action":"Notify","status":"active"},
        {"id":3,"ruleName":"af","schedule":"Every day at 12:00 AM","condition":"as","action":"Notify","status":"active"},
        {"id":4,"ruleName":"aq","schedule":"Every 15 Min","condition":"asf","action":"Notify","status":"active"},
        {"id":5,"ruleName":"ae","schedule":"Every day at 12:00 AM","condition":"fregfe","action":"Notify","status":"inactive"},
        {"id":6,"ruleName":"aw","schedule":"Every Hour","condition":"eg4","action":"Notify","status":"active"}
    ];
*/

    $scope.getAllMetrics = function(){
        $http({
            method: 'GET',
            url: '/api/metrics/getAll',
        }).then(function(data, status, headers, config) {
            $scope.showLoader = false;
            $scope.allMetrics = data.data.metricList;

        }, function(data, status, headers, config) {
            $scope.commonPopupMsg = 'Something went wrong. Please try again.';
            $scope.showCommPopup = true;
            $scope.showLoader = false;
        });
    };
    $scope.getAllCampaigns = function(){
        $http({
            method: 'GET',
            url: '/api/campaigns/getAll',
        }).then(function(data, status, headers, config) {
            $scope.showLoader = false;
            $scope.allCampaigns = data.data.campaignList;

        }, function(data, status, headers, config) {
            $scope.commonPopupMsg = 'Something went wrong. Please try again.';
            $scope.showCommPopup = true;
            $scope.showLoader = false;
        });
    };
    $scope.getAllRules = function(){
        $http({
            method: 'GET',
            url: '/api/rules/getAll',
        }).then(function(data, status, headers, config) {
            $scope.showLoader = false;
            $scope.allRules = data.data.rulesList;

        }, function(data, status, headers, config) {
            $scope.commonPopupMsg = 'Something went wrong. Please try again.';
            $scope.showCommPopup = true;
            $scope.showLoader = false;
        });
    };

    $scope.getAllCampaigns();
    $scope.getAllMetrics();
    $scope.getAllRules();

    $scope.parseCampaign = function (idArray) {
        try {
            idArray = JSON.parse(idArray);
        }catch (e){
            idArray = idArray;
        }
        let campaigns = [];
        $scope.allCampaigns.forEach(function (campaign) {
            if(idArray.indexOf(campaign.id) > -1){
                campaigns.push(campaign.name);
            }
        });
        return campaigns.join(',');
    }

    function arrayRotateOne(arr, reverse) {
        if (reverse) {
            arr.unshift(arr.pop());
        }
        else {
            arr.push(arr.shift());
        }
        return arr;
    }

}]);