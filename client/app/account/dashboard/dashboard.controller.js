"use strict";

angular.module('workspaceApp').controller('DashboardCtrl', function ($scope) {
    $scope.showNewPoll = true;
    $scope.showPollManage = false;
      
    $scope.togglePoolCreation = function() {
        if ($scope.showPollManage) {
            $scope.showPollManage = false;
        }
        
        $scope.showNewPoll = !$scope.showNewPoll;
    };
      
    $scope.togglePoolManage = function() {
        if ($scope.showNewPoll) {
            $scope.showNewPoll = false;
        }
        
        $scope.showPollManage = !$scope.showPollManage;
    };
  });