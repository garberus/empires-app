'use strict';

/* Directives */

var CONST = {
  CHART_HEIGHT: 350,
  CHART_INTERPOLATION: 'monotone',
  X_LABEL: 'game'
};

var directives = angular.module('EmpiresApp.directives', []);

/**
 * The chart directive / will generate a chart with data from the last five games.
 * Usage:
 *    <chart></chart>
 */
directives.directive('chart', ['dataService', 'd3injectionService', '$document',

  function(dataService, d3Service, $document) {

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

          var xAxis = d3.svg.axis().scale(x).ticks(5).tickFormat(function(d) {
            return CONST.X_LABEL + ' ' + d;
          });
          var yAxis = d3.svg.axis().scale(y).ticks(10).tickSize(w).orient('right');

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
              .style('fill', player.color);
          });

        };

        d3Service.inject(function(error, d3) {
          $scope.render(d3);
        });

      },

      restrict: 'E',
      scope: {
        ngModel: '='
      }
    }
  }
]);
