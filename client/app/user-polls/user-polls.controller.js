"use strict";

angular.module('workspaceApp').controller('UserPollCtrl', function ($scope, $http, $routeParams, $location, Auth) {
    var getCurrentUser = Auth.getCurrentUser,
        isLoggedIn = Auth.isLoggedIn(),
        alreadyVoted = false,
        userId = "",
        poll = [];
    
    $scope.showVotedMessage = false;
    $scope.showPollVote = false;
    $scope.showPollResults = false;
    $scope.notLoggedIn = false;
    $scope.pollQuestion = "";
    $scope.pollOptions = [];
    $scope.pollLink = "";
    $scope.pollPathname = "";
    
    function displayLinkToPoll() {
        $scope.pollPathname = "/" + $routeParams.user.toLowerCase() + "/" + poll.pollId;
        $scope.pollLink = location.origin + $scope.pollPathname;
    }
    
    function checkIfVoted() {
        if (isLoggedIn) {
            for (var i = 0; i < poll.whoVoted.length; i++) {
                if (poll.whoVoted[i] === getCurrentUser().name.toLowerCase()) {
                    alreadyVoted = true;
                    $scope.showPollVote = false;
                    $scope.showPollResults = true;
                    break;
                }
            }
            
            if (!alreadyVoted) {
                $scope.showPollVote = true;
                $scope.showPollResults = false;
            }
        }
        else {
            $scope.showPollVote = false;
            $scope.showPollResults = true;
        }
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
                        displayLinkToPoll();
                        checkIfVoted();
                        break;
                    }
                }
                break;
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
        
        if (!isLoggedIn) {
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
        displayLinkToPoll();
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
