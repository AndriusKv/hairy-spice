"use strict";

angular.module('workspaceApp').controller('DashboardCtrl', function ($scope) {
    $scope.showNewPoll = true;
    $scope.showPollManage = false;
    $scope.pollQuestion = "";
    $scope.createdPolls = [];
    $scope.options = [1, 2];
      
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
    
    $scope.addOption = function() {
        var i = $scope.options[$scope.options.length - 1];
        
        $scope.options.push(++i);
    };
    
    $scope.createPoll = function(pollQuestion) {
        var question = pollQuestion;
        
        if (question.charAt(question.length - 1) !== "?") {
            question = question + "?";
        }
        
        $scope.createdPolls.push({question: question});
    };
    
    $scope.deleteCreatedPoll = function(index) {
        $scope.createdPolls.splice(index, 1);
    };
  });