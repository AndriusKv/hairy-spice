"use strict";

angular.module('workspaceApp').controller('UserPollCtrl', function ($scope, $http, $routeParams, $location) {
    var poll = [];
    
    $scope.showPollVote = false;
    $scope.showPollResults = false;
    $scope.pollQuestion = "";
    $scope.pollOptions = [];
    
    $http.get('/api/users/user').success(function(users) {
        var username = $routeParams.user.toLowerCase(),
            id = parseInt($routeParams.pollId, 10),
            foundPoll = false,
            user;
        
        for (var i = 0; i < users.length; i++) {
            if (foundPoll) {
                break;
            }
            
            user = users[i];
            if (user.name.toLowerCase() === username) {
                for (var j = 0; j < user.polls.length; j++) {
                    if (user.polls[j].pollId === id) {
                        poll = user.polls[j];
                        foundPoll = true;
                        break;
                    }
                }
            }
        }
        
        if (!foundPoll) {
            $location.path("/");
        }
        
        $scope.pollQuestion = poll.question;
        $scope.pollOptions = poll.pollOptions;
        
        console.log(users);
    });
    
    console.log($routeParams);
    
    $scope.togglePollVote = function() {
        if ($scope.showPollResults) {
            $scope.showPollResults = false;
        }
        
        $scope.showPollVote = !$scope.showPollVote;
    };
    
    $scope.togglePoolResults = function() {
        if ($scope.showPollVote) {
            $scope.showPollVote = false;
        }
        
        $scope.showPollResults = !$scope.showPollResults;
        
        console.log(poll);
    };
});
