"use strict";
angular.module('mean').controller('mainController', ['$scope', '$stateParams', 'Global', 'Articles', '$state','$cookieStore', 'SignOut','$rootScope','$http',function ($scope, $stateParams, Global, Articles, $state, $cookieStore, SignOut, $rootScope,$http) {
    // $scope.global = Global;
    // $state.go("/");
    $scope.showLoader = true;
    $scope.userName = $cookieStore.get('name');
    $scope.newRule = false;
    $scope.operations=[{"id":"1","name":">="},{"id":"2","name":"<="},{"id":'3',"name":"="}];
    $scope.allSchedule=[{"id":"1","name":"Every 15 Min"},{"id":"2","name":"Every Hour"},{"id":'3',"name":"Every day at 12:00 AM"}];
    $scope.allOperator=[{"id":"1","name":"AND"},{"id":"2","name":"OR"}];
    var initCondition={"operation":"3","metric":2,"operator":"1"};
    $scope.initRule = {"id":"new","ruleName":"","schedule":1,"condition":[{"operation":"1","metric":1}],"action":"Notify","status":"1"};
    $rootScope.signOut = function(){
        SignOut.get(function(response){
            if(response.status === 'success'){
                $cookieStore.remove('name');
                $cookieStore.remove('email');
                $scope.global = null;
                $scope.showLoader = false;
                $state.go('SignIn');
            }
        });
    };
    if(!$scope.userName){
        $cookieStore.remove('name');
        $cookieStore.remove('email');
        $scope.global = null;
        $state.go('SignIn');
    }
    $scope.isCollapsed = false;

    $scope.createRule = function (callType,rule) {
        if(callType === 'show'){
            if(rule==='new') {
                $scope.rule = angular.copy($scope.initRule);
            }
            else {
                $scope.rule = angular.copy(rule);
            }
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
        try {
            model.campaign_id = JSON.parse(model.campaign_id);
        }catch (e) {
            
        }
        try {
            model.condition = JSON.parse(model.condition);
        }catch (e) {

        }
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
        $scope.showLoader = true;
        $http({
            method: 'GET',
            url: '/api/metrics/getAll',
        }).then(function(data, status, headers, config) {
            $scope.showLoader = false;
            $scope.allMetrics = data.data.metricList;
            $scope.getAllRules();

        }, function(data, status, headers, config) {
            $scope.commonPopupMsg = 'Something went wrong. Please try again.';
            $scope.showCommPopup = true;
            $scope.showLoader = false;
        });
    };
    $scope.getAllCampaigns = function(){
        $scope.showLoader = true;
        $http({
            method: 'GET',
            url: '/api/campaigns/getAll',
        }).then(function(data, status, headers, config) {
            $scope.showLoader = false;
            $scope.allCampaigns = data.data.campaignList;
            $scope.getAllMetrics();

        }, function(data, status, headers, config) {
            $scope.commonPopupMsg = 'Something went wrong. Please try again.';
            $scope.showCommPopup = true;
            $scope.showLoader = false;
        });
    };
    $scope.getAllRules = function(){
        $scope.showLoader = true;
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

    $scope.parseCampaign = function (idArray) {
        try {
            idArray = JSON.parse(idArray);
        }catch (e){
            idArray = idArray;
        }
        if(!(idArray instanceof Array)){
            idArray = [idArray];
        }
        let campaigns = [];
        $scope.allCampaigns.forEach(function (campaign) {
            if(idArray.indexOf(campaign.id) > -1){
                campaigns.push(campaign.name);
            }
        });
        return campaigns.join(',');
    }
    $scope.parseSchedule = function (schedule) {
        let name = '';
        $scope.allSchedule.forEach(function (sch) {
            if(sch.id===schedule){
                name = sch.name+'';
            }
        });
        return name;
    }

    $scope.parseCondition= function (condition) {
        if(!$scope.allMetrics){
            $scope.getAllMetrics();
        }
        try {
            condition = JSON.parse(condition);
        }catch (e){
            condition = condition;
        }
        let conditions = '';
        condition.forEach(function (cond,index) {
            if(index>0){
                conditions +=' ' +$scope.allOperator.find(o => o.id === cond.operator).name;
            }
            conditions += ' ' +$scope.allMetrics.find(o => o.id === cond.metric).name;
            conditions += ' ' +$scope.operations.find(o => o.id === cond.operation).name;
            conditions += ' ' +cond.value;
        });
        return conditions;
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
    $scope.addCondition = function (conditionArray) {
        conditionArray.push(angular.copy(initCondition));
    };
    $scope.deleteCondition = function (conditionArray,index) {
        conditionArray.splice(index,1);
    };

}]);