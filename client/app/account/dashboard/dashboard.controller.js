"use strict";

angular.module('workspaceApp').controller('DashboardCtrl', function ($scope, $http, Auth) {
    var getCurrentUser = Auth.getCurrentUser,
        id = 0;
    
    $scope.showNewPoll = true;
    $scope.showAllUserPolls = false;
    $scope.showYourPoll = false;
    $scope.pollCreated = false;
    $scope.pollPathname = "";
    $scope.pollLink = "";
    $scope.pollQuestionInput = "";
    $scope.createdPolls = [];
    $scope.options = [1, 2];

    $http.get('/api/users/me/polls').success(function(polls) {
        $scope.createdPolls = polls;
    });
    
    $scope.resetPollForm = function() {
        if ($scope.showYourPoll) {
            $scope.showYourPoll = false;
        }
        
        if ($scope.pollCreated) {
            $scope.pollPathname = "";
            $scope.pollLink = "";
            $scope.pollCreated = false;
        }  
    };
    
    $scope.showPollCreation = function() {
        if ($scope.showAllUserPolls) {
            $scope.showAllUserPolls = false;
        }
        
        $scope.resetPollForm();
        
        $scope.showNewPoll = true;
    };
      
    $scope.showPollManager = function() {
        if ($scope.showNewPoll) {
            $scope.showNewPoll = false;
        }

        $scope.resetPollForm();
        
        $scope.showAllUserPolls = true;
        
        $http.get('/api/users/me/polls').success(function(polls) {
            $scope.createdPolls = polls;
        });
    };
    
    $scope.showCreatedPoll = function(index) {
        var poll = $scope.createdPolls[index];

        if ($scope.showAllUserPolls) {
            $scope.showAllUserPolls = false;
        }
        
        $scope.showYourPoll = true;
        
        $scope.pollQuestion = poll.question;
        $scope.pollOptions = poll.pollOptions;
        
        $scope.pollPathname = "/" + getCurrentUser().name.toLowerCase() + "/" + poll.pollId;
        $scope.pollLink = location.host + $scope.pollPathname;
    };
    
    $scope.addOption = function() {
        var i = $scope.options[$scope.options.length - 1];
        
        $scope.options.push(++i);
    };
    
    $scope.createPoll = function(pollQuestion) {
        var polls = $scope.createdPolls,
            question = pollQuestion,
            options = document.querySelectorAll(".option-input"),
            newPoll = {},
            pollOptions = [];
        
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
        
        for (i = 0; i <  polls.length; i++) {
            if (parseInt(polls[i].pollId, 10) > id) {
                id = parseInt(polls[i].pollId, 10);
            }
        }
        
        newPoll.pollId = ++id;
        newPoll.question = question;
        newPoll.pollOptions = pollOptions;
        newPoll.whoVoted = [];
        
        $scope.pollPathname = "/" + getCurrentUser().name.toLowerCase() + "/" + id;
        $scope.pollLink = location.host + $scope.pollPathname;
        $scope.showNewPoll = false;
        $scope.pollCreated = true;
        $scope.options.length = 2;
        $http.post('/api/users/me/polls', newPoll);
    };
    
    $scope.deleteCreatedPoll = function(poll, index) {
        $http.put('/api/users/me/polls/' + index);
        $scope.createdPolls.splice(index, 1);
    };
});
