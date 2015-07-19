"use strict";

angular.module('workspaceApp').controller('DashboardCtrl', function ($scope, $http, $location, Auth) {
    var getCurrentUser = Auth.getCurrentUser,
        id = 0;
    
    $scope.showNewPoll = true;
    $scope.showAllUserPolls = false;
    $scope.showYourPoll = false;
    $scope.pollCreated = false;
    $scope.pollPathname = "";
    $scope.pollLink = "";
    $scope.pollQuestionInput = "";
    $scope.pollQuestion = "";
    $scope.pollOptions = [];
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
        
        $location.path("/" + getCurrentUser().name.toLowerCase() + "/" + poll.pollId);
    };
    
    $scope.addOption = function() {
        var i = $scope.options[$scope.options.length - 1];
        
        $scope.options.push(++i);
    };
    
    $scope.createPoll = function(pollQuestion) {
        var polls = $scope.createdPolls,
            question = pollQuestion,
            options = document.querySelectorAll(".option-input"),
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
        
        id += 1;
        $scope.pollPathname = "/" + getCurrentUser().name.toLowerCase() + "/" + id;
        $scope.pollLink = location.host + $scope.pollPathname;
        $scope.showNewPoll = false;
        $scope.pollCreated = true;
        $scope.options.length = 2;
        $http.post('/api/users/me/polls', {
            pollId: id,
            question: question,
            pollOptions: pollOptions,
            whoVoted: []
        });
    };
    
    $scope.deleteCreatedPoll = function(poll, index) {
        $http.put('/api/users/me/polls/' + index);
        $scope.createdPolls.splice(index, 1);
    };
});