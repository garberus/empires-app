'use strict';

/* Directives */

var services = angular.module('EmpiresApp.services', []);

services.service('scriptInjector', ['$document', '$q', '$rootScope',

  function($document, $q, $rootScope) {

    var _queue = {};

    console.log('(EmpiresApp.services.scriptInjector) started');

    this.inject = function inject(url, identifier, cb) {

      var d = $q.defer();

      function _onScriptLoad() {
        // Load client in the browser
        $rootScope.$apply(function() {
          console.log('(EmpiresApp.services.scriptInjector) injected:', url);
          d.resolve(window[identifier]);
          _queue[identifier].resolved = true;
        });
      }

      if (!_queue[identifier]) {
        _queue[identifier] = { resolved: false, promise: d };
        // Create a script tag with d3 as the source
        // and call our onScriptLoad callback when it
        // has been loaded
        var scriptTag = $document[0].createElement('script');
        scriptTag.type = 'text/javascript';
        scriptTag.async = true;
        scriptTag.src = url;
        scriptTag.id = identifier;
        scriptTag.onreadystatechange = function () {
          if (this.readyState == 'complete') _onScriptLoad();
        };
        scriptTag.onload = _onScriptLoad;

        var s = $document[0].getElementsByTagName('body')[0];
        s.appendChild(scriptTag);

      } else {
        if (_queue[identifier].resolved === true) {
          // Immediately resolve the promise with the available module
          d.resolve(window[identifier]);
        } else {
          d = _queue[identifier].promise;
        }
      }
      cb(d.promise);
    }
  }]);

services.service('d3injectionService', ['scriptInjector', function(injector) {
  this.inject = function inject(cb) {
    injector.inject('http://d3js.org/d3.v3.min.js', 'd3', function(d3promise) {
      d3promise.then(function(d3) {
        injector.inject('./bower_components/d3-tip/index.js', 'd3tip', function(tipPromise) {
          tipPromise.then(function(d3Tip) {
            console.log('(EmpiresApp.services.jsonDataService) d3 available');
            cb(null, d3, d3Tip);
          })
        });
      });
    });
  };
}]);

services.service('dataService', ['$http', function($http) {

  this.getStaticStatsTableData = function getStaticStatsTableData(cb) {
    cb(null, {});
  };

  this.getStaticBarChartData = function getStaticBarchartData(cb) {
    cb(null, [
      {
        name: 'Johan',
        value: '0',
        color: '#D96383'
      },
      {
        name: 'Jonas',
        value: '2',
        color: '#CF5C60'
      },
      {
        name: 'Gustav',
        value: '2',
        color: '#F3AE4E'
      },
      {
        name: 'Pontus',
        value: '1',
        color: '#4AB471'
      },
      {
        name: 'Henrik',
        value: '3',
        color: '#4EB1CB'
      }
    ]);
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
