'use strict';

/* Controllers */

angular.module('EmpiresApp.controllers', [])
  .controller('MainController', ['$scope', '$rootScope', function($scope, $root) {
    console.log('(MainController)', 'this controller runs');
    $root.gp = 5;
}]);
