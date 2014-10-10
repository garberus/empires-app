'use strict';

/* Directives */

var services = angular.module('EmpiresApp.services', []);

services.service('dataService', ['$http', function($http) {

  this._getData = function(cb) {

    $http({
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      url: './data/gamedata.json',
      cache: false
    }).success(function(data) {

      if (cb && typeof cb === 'function') {
        cb(data);
      }

    }).error(function() {
      throw 'Could not load data.';
    });

  };

  this.getGameData = function getGameData(key, cb) {

    var _gamedata = null;

    this._getData(function(data) {

      data.forEach(function(obj) {
        if (obj[key]) {
          _gamedata = obj[key];
        }
      });

      if (cb && typeof cb === 'function') {
        cb(_gamedata);
      }

    });

  };

  this.getStaticData = function getStaticData() {


    return [{
      name: 'Johan',
      form: [
        { y: 154, x: 1 },
        { y: 176, x: 2 },
        { y: 180, x: 3 },
        { y: 156, x: 4 },
        { y: 152, x: 5 }
      ],
      color: '#D96383'
    },
    {
      name: 'Jonas',
      form: [
        { y: 189, x: 1 },
        { y: 190, x: 2 },
        { y: 175, x: 3 },
        { y: 167, x: 4 },
        { y: 180, x: 5 }
      ],
      color: '#CF5C60'
    },
    {
      name: 'Gustav',
      form: [
        { y: 167, x: 1 },
        { y: 169, x: 2 },
        { y: 175, x: 3 },
        { y: 180, x: 4 },
        { y: 190, x: 5 }
      ],
      color: '#F3AE4E'
    },
    {
      name: 'Pontus',
      form: [
        { y: 200, x: 1 },
        { y: 176, x: 2 },
        { y: 160, x: 3 },
        { y: 203, x: 4 },
        { y: 164, x: 5 }
      ],
      color: '#4AB471'
    },
    {
      name: 'Henrik',
      form: [
        { y: 203, x: 1 },
        { y: 194, x: 2 },
        { y: 186, x: 3 },
        { y: 176, x: 4 },
        { y: 190, x: 5 }
      ],
      color: '#4EB1CB'
    }];
  };

}]);
