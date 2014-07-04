'use strict';

angular.module('EmpiresApp', [
    'ngRoute',
    'EmpiresApp.services',
    'EmpiresApp.directives',
    'EmpiresApp.controllers'
  ]).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'views/main.html', controller: 'MainController'});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
