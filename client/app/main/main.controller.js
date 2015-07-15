'use strict';

angular.module('workspaceApp').controller('MainCtrl', function ($scope, Auth) {
    $scope.isLoggedIn = Auth.isLoggedIn;
    
    $scope.logout = function() {
      Auth.logout();
    };
    
 });
