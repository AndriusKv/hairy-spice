"use strict";

angular.module('workspaceApp').controller('UserPollCtrl', function ($scope, $http, $routeParams, $location, Auth) {
    var getCurrentUser = Auth.getCurrentUser,
        alreadyVoted = false,
        userId = "",
        poll = [];
    
    $scope.showVotedMessage = false;
    $scope.showPollVote = true;
    $scope.showPollResults = false;
    $scope.notLoggedIn = false;
    $scope.pollQuestion = "";
    $scope.pollOptions = [];
    $scope.pollLink = "";
    $scope.pollPathname = "";
    
    if (!Auth.isLoggedIn()) {
        $scope.showPollVote = false;
        $scope.notLoggedIn = true;
    }
    
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
                        userId = user.id;
                        poll = user.polls[j];
                        foundPoll = true;
                        
                        for (var k = 0; k < poll.whoVoted.length; k++) {
                            if (poll.whoVoted[k] === getCurrentUser().name.toLowerCase()) {
                                alreadyVoted = true;
                                $scope.showPollVote = false;
                                $scope.showPollResults = true;
                                break;
                            }
                        }
                        
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
    });
    
    $scope.togglePollVote = function() {
        if ($scope.showPollResults) {
            $scope.showPollResults = false;
        }
        
        if (!Auth.isLoggedIn()) {
            $scope.notLoggedIn = true;
            return;
        }
        
        if (alreadyVoted) {
            $scope.showVotedMessage = true;
            return;
        }
        
        $scope.showPollVote = true;
    };
    
    $scope.togglePoolResults = function() {
        if ($scope.showPollVote) {
            $scope.showPollVote = false;
        }
        
        if ($scope.notLoggedIn) {
            $scope.notLoggedIn = false;
        }
        
        if ($scope.showVotedMessage) {
            $scope.showVotedMessage = false;
        }
        
        $scope.showPollResults = true;
        $scope.pollPathname = "/" + $routeParams.user.toLowerCase() + "/" + poll.pollId;
        $scope.pollLink = location.origin + $scope.pollPathname;
    };
    
    $scope.voteOnPoll = function() {
        var options = document.getElementsByTagName("form")[0].elements["option"];

        for (var i = 0; i < options.length; i++) {
            if (options[i].checked) {
                poll.pollOptions[i].votes += 1;
                poll.whoVoted.push(getCurrentUser().name.toLowerCase());
                alreadyVoted = true;
                $scope.togglePoolResults();
                $http.put('/api/users/' + userId, poll);
                break;
            }
        }
    };
});
