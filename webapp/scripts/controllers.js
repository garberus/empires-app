'use strict';

/* Controllers */

angular.module('EmpiresApp.controllers', [])
  .controller('MainController', ['$scope', '$rootScope', 'dataService',
    function($scope, $root, dataService) {
      dataService.getGameData('games_played', function(p) {
        $root.gp = p || 0;
      });
}]);
