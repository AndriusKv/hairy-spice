"use strict";

angular.module('workspaceApp').controller('DashboardCtrl', function ($scope, $http, $routeParams) {
    $scope.showNewPoll = true;
    $scope.showPollManage = false;
    $scope.pollQuestion = "";
    $scope.createdPolls = [];
    $scope.options = [1, 2];
    
    $http.get('/api/users/user').success(function(user) {
        console.log(user);
    });
    
    $scope.togglePoolCreation = function() {
        if ($scope.showPollManage) {
            $scope.showPollManage = false;
        }
        
        $scope.showNewPoll = !$scope.showNewPoll;
        
        $http.get('/api/users/me/polls').success(function(polls) {
            console.log(polls);
            $scope.createdPolls = polls;
        });
    };
      
    $scope.togglePoolManage = function() {
        if ($scope.showNewPoll) {
            $scope.showNewPoll = false;
        }
        
        $scope.showPollManage = !$scope.showPollManage;
        
        $http.get('/api/users/me/polls').success(function(polls) {
            console.log(polls);
            $scope.createdPolls = polls;
        });
    };
    
    $scope.addOption = function() {
        var i = $scope.options[$scope.options.length - 1];
        
        $scope.options.push(++i);
    };
    
    $scope.createPoll = function(pollQuestion) {
        var question = pollQuestion,
            options = document.querySelectorAll(".option-input"),
            newPoll = {},
            pollOptions = [],
            id = 0;
        
        if (question === '' || options[0].value === "" || options[1].value === "") {
            return;
        }
        
        for (var i = 0; i < options.length; i++) {
            if (options[i] !== "") {
                pollOptions.push({option: options[i].value, votes: 0});
            }
        }
        
        if (question.charAt(question.length - 1) !== "?") {
            question = question + "?";
        }
        
        for (i = 0; i <  $scope.createdPolls.length; i++) {
            if ($scope.createdPolls[i].id > id) {
                id = $scope.createdPolls[i].id;
            }
        }
        newPoll.pollId = ++id;
        newPoll.question = question;
        newPoll.pollOptions = pollOptions;
        
        $http.post('/api/users/me/polls', newPoll);
    };
    
    $scope.deleteCreatedPoll = function(poll, index) {
        $http.put('/api/users/me/polls/' + index);
        $scope.createdPolls.splice(index, 1);
    };
    
    $scope.showCreatedPoll = function(index) {
        console.log($scope.createdPolls[index]);
        console.log($routeParams);
    };
});
