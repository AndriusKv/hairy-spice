angular.module('workspaceApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/:user/:pollId', {
        templateUrl: 'app/user-polls/user-polls.html',
        controller: 'UserPollCtrl'
      });
  });