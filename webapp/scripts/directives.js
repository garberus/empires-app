'use strict';

/* Directives */

var CONST = {
  CHART_HEIGHT: 350,
  CHART_INTERPOLATION: 'monotone',
  X_LABEL: 'game',
  BARCHART_NUMBER_SPACING: 200
};

var BARCHART_TYPE = {
  MOST_WINS: 'wins',
  MOST_POINTS: 'points',
  MOST_POINTS_IN_A_GAME: 'game',
  MOST_BATTLES_WON: 'battles'
};

var directives = angular.module('EmpiresApp.directives', []);

/**
 * The chart directive / will generate a chart with data from the last five games.
 * Usage:
 *    <formchart></formchart>
 */
directives.directive('formchart', ['dataService', 'd3injectionService',

  function(dataService, d3Service) {

    return {

      link: function($scope, iElement, iAttrs) {

        console.log('(EmpiresApp.directives.chart) chart detected', iElement);

        var w = iElement[0].parentElement.getBoundingClientRect().width;
        var h = CONST.CHART_HEIGHT;

        var formData = dataService.getStaticData();

        $scope.render = function render(d3) {

          var y = d3.scale.linear().domain([215, 145]).range([0, h]);
          var x = d3.scale.linear().domain([0.8, 5.1]).range([0, w]);

          var lineFunction = d3.svg.line()
            .x(function(d) { return x(d.x); })
            .y(function(d) { return y(d.y); })
            .interpolate(CONST.CHART_INTERPOLATION);

          var svgContainer = d3.select(iElement[0]).append('svg')
            .attr('width', w)
            .attr('height', h);

          var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return '' + d.y + '';
            });

          var xAxis = d3.svg.axis().scale(x).ticks(5).tickFormat(function(d) {
            return CONST.X_LABEL + ' ' + d;
          });
          var yAxis = d3.svg.axis().scale(y).ticks(10).tickSize(w).orient('right');

          svgContainer.call(tip);

          svgContainer.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + (h - 25) + ')')
            .call(xAxis)
            .selectAll('text')
            .attr('y', 10)
            .attr('x', -12)
            .style('text-anchor', 'start');

          svgContainer.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .selectAll('text')
            .attr('y', -7)
            .attr('x', 5)
            .style('text-anchor', 'start');

          var group = null;

          formData.forEach(function(player) {
            group = svgContainer.append('g');
            group.append('path')
              .attr('d', lineFunction(player.form))
              .attr('stroke', player.color)
              .attr('stroke-width', 2)
              .attr('fill', 'none');
            group.selectAll('circle')
              .data(player.form)
              .enter()
              .append('circle')
              .attr('cx', function(d) { return x(d.x); })
              .attr('cy', function(d) { return y(d.y); })
              .attr('r', 3)
              .style('fill', player.color)
              .on('mouseover', tip.show)
              .on('mouseout', tip.hide);
          });

        };

        d3Service.inject(function(error, d3, d3Tip) {
          $scope.render(d3, d3Tip);
        });

      },

      restrict: 'E',
      scope: {
        ngModel: '='
      }
    }
  }
]);

/**
 * The barchart directive / will generate a barchart with data dependent on the
 * type attribute.
 * Usage:
 *    <barchart ng-type="<type>"></barchart>
 */
directives.directive('barchart', ['dataService',

  function(dataService) {

    return {

      controller: function($scope) {

        $scope.renderWinsBarchart = function renderWinsBarchart() {

          $scope.heading = 'Most wins';

          dataService.getStaticBarChartData(function(error, data) {

            var max = $scope._calculateBarMaxValue(data);
            var i = 0, l = data.length;
            for (; i < l; i++) {
              data[i].width = $scope._calculateBarWidth(parseInt(data[i].value), max);
            }
            $scope.scores = data;
          });

        };

        $scope._calculateBarWidth = function calculateBarWidth(value, t) {
          return Math.round(value/t*100) - 10;
        };

        $scope._calculateBarMaxValue = function calculateBarWidth(scores) {
          var i = 0, l = scores.length, max = 0;
          for (; i < l; i++) {
            max = parseInt(scores[i].value) > max ? parseInt(scores[i].value) : max;
          }
          return max;
        };

      },

      link: function($scope, iElement, iAttrs) {

        console.log('(EmpiresApp.directives.barchart) started...', iElement);

        switch(iAttrs.ngType) {

          case BARCHART_TYPE.MOST_WINS:
              $scope.renderWinsBarchart();
            break;

        }

      },

      restrict: 'E',
      scope: {
        ngModel: '='
      },
      templateUrl: 'views/partials/barchart.html'
    }
  }
]);

/**
 * The statstable directive / will generate a stats table with data.
 * Usage:
 *    <statstable></statstable>
 */
directives.directive('statstable', ['dataService',

  function(dataService) {

    return {

      controller: function($scope) {

        $scope.render = function render() {

          dataService.getStaticStatsTableData(function(error, data) {

            $scope.highestPoints = data.highestPoints || 209;
            $scope.averagePoints = data.averagePoints || 170;
            $scope.cardsPlayed = data.cardsPlayed || 4.567;
            $scope.battlesFought = data.battlesFought || 10.567;

          });
        };
      },

      link: function($scope, iElement, iAttrs) {

        console.log('(EmpiresApp.directives.statstable) started...', iElement);

        $scope.render();

      },

      restrict: 'E',
      scope: {
        ngModel: '='
      },
      templateUrl: 'views/partials/stats-table.html'
    }
  }
]);
