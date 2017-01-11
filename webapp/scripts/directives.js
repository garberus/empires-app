'use strict';

/* Directives */

var CONST = {
  CHART_HEIGHT: 350,
  CHART_INTERPOLATION: 'monotone',
  X_LABEL: 'game',
  BARCHART_NUMBER_SPACING: 200,
  X_TICKS: 5
};

var BARCHART_TYPE = {
  MOST_WINS: 'wins',
  MOST_PLAYED: 'played',
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
directives.directive('formchart', ['dataService',

  function(dataService) {

    return {

      link: function($scope, iElement, iAttrs) {

        var w = iElement[0].parentElement.getBoundingClientRect().width;
        var h = CONST.CHART_HEIGHT;

        $scope.render = function render(formData) {

          var gp = formData[0].form.length;

          var y = d3.scale.linear().domain([215, 120]).range([0, h]);
          var x = d3.scale.linear().domain([gp - CONST.X_TICKS + 0.8, gp + 0.1]).range([0, w]);

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
              return d.y;
            });

          var xAxis = d3.svg.axis().scale(x).ticks(CONST.X_TICKS).tickFormat(function(d) {
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
            var slice = player.form.reverse();
            group = svgContainer.append('g');
            group.append('path')
              .attr('d', lineFunction(slice))
              .attr('stroke', player.color)
              .attr('stroke-width', 2)
              .attr('fill', 'none');
            group.selectAll('circle')
              .data(slice)
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

        dataService.getGameData('form', function(data) {
          $scope.render(data);
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

          dataService.getGameData('most_wins', function(data) {

            if (data) {

              var max = $scope._calculateBarMaxValue(data);
              var i = 0, l = data.length;
              for (; i < l; i++) {
                data[i].width =
                    $scope._calculateBarWidth(parseInt(data[i].wins), max);
                data[i].value = data[i].wins + ' (' + Math.round((data[i].wins/data[i].games)*100) + '%)';
              }
              $scope.scores = data;
            }

          });

        };

        $scope.renderPlayedBarchart = function renderPlayedBarchart() {

          $scope.heading = 'Most games played';

          dataService.getGameData('most_wins', function(data) {

            if (data) {

              data.sort(function(a, b) {
                return a.games < b.games;
              });

              var max = $scope._calculatePlayedBarMaxValue(data);
              var i = 0, l = data.length;
              for (; i < l; i++) {
                data[i].width =
                  $scope._calculateBarWidth(parseInt(data[i].games), max);
                data[i].value = data[i].games;
              }
              $scope.scores = data;
            }

          });

        };

        $scope.renderPointsBarchart = function renderPointsBarchart() {

          $scope.heading = 'Most accumulated points';

          dataService.getGameData('most_points', function(data) {

            if (data) {

              var max = $scope._calculateBarMaxValue(data);
              var i = 0, l = data.length;
              for (; i < l; i++) {
                data[i].width =
                  $scope._calculateBarWidth(parseInt(data[i].points), max);
                data[i].value = data[i].points;
              }
              $scope.scores = data;
            }

          });

        };

        $scope.renderBattlesBarchart = function renderBattlesBarchart() {

          $scope.heading = 'Most battles won';

          dataService.getGameData('battle_data', function(data) {

            if (data) {

              var max = $scope._calculateBarMaxValue(data);
              var i = 0, l = data.length;
              for (; i < l; i++) {
                data[i].width =
                  $scope._calculateBarWidth(parseInt(data[i].wins), max);
                data[i].value = data[i].wins;
              }
              $scope.scores = data;
            }

          });

        };

        $scope.renderPointsInGameBarchart = function renderPointsInGameBarchart() {

          $scope.heading = 'Most points in a game';

          dataService.getGameData('most_points_game', function(data) {

            if (data) {

              var max = $scope._calculateBarMaxValue(data);
              var i = 0, l = data.length;
              for (; i < l; i++) {
                data[i].width =
                  $scope._calculateBarWidth(parseInt(data[i].points), max);
                data[i].value = data[i].points;
              }
              $scope.scores = data;
            }

          });

        };

        $scope._calculateBarWidth = function calculateBarWidth(value, t) {
          return Math.round(value/t*(100-20));
        };

        $scope._calculateBarMaxValue = function calculateBarWidth(scores) {
          var i = 0, l = scores.length, max = 0;
          for (; i < l; i++) {
            max = parseInt(scores[i].wins || scores[i].points) > max ? parseInt(scores[i].wins || scores[i].points) : max;
          }
          return max;
        };

        $scope._calculatePlayedBarMaxValue = function calculatePlayedBarMaxValue(scores) {
          var i = 0, l = scores.length, max = 0;
          for (; i < l; i++) {
            max = parseInt(scores[i].games) > max ? parseInt(scores[i].games) : max;
          }
          return max;
        };

      },

      link: function($scope, iElement, iAttrs) {

        switch(iAttrs.ngType) {

          case BARCHART_TYPE.MOST_WINS:
            $scope.renderWinsBarchart();
            break;

          case BARCHART_TYPE.MOST_PLAYED:
            $scope.renderPlayedBarchart();
            break;

          case BARCHART_TYPE.MOST_POINTS:
            $scope.renderPointsBarchart();
            break;

          case BARCHART_TYPE.MOST_BATTLES_WON:
            $scope.renderBattlesBarchart();
            break;

          case BARCHART_TYPE.MOST_POINTS_IN_A_GAME:
            $scope.renderPointsInGameBarchart();
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

          dataService.getGameData('highest_scores', function(p) {
            $scope.highestPoints = p || 0;
          });

          dataService.getGameData('average_points', function(p) {
            $scope.averagePoints = p || 0;
          });

          dataService.getGameData('cards_played', function(p) {
            $scope.cardsPlayed = p || 0;
          });

          dataService.getGameData('battles_fought', function(p) {
            $scope.battlesFought = p || 0;
          });

        };
      },

      link: function($scope, iElement, iAttrs) {

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
