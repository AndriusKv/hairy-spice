'use strict';

angular.module('workspaceApp').controller('MainCtrl', function ($scope, $http, Auth) {
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.runningPolls = [];
    
    $http.get('/api/users/user').success(function(users) {
        users.map(function(user) {
            user.polls.map(function(poll) {
                $scope.runningPolls.push({
                    linkToPoll: "/" + user.name + "/" + poll.pollId,
                    question: poll.question
                });
            });
        });
    });
    
    $scope.logout = function() {
      Auth.logout();
    };
    
 });
