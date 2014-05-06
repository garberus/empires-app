/*jslint node: true */

'use strict';

/**
 * ViewAggregator. Aggregates different types of statistics from game
 * reports produced by the parser.js.
 * @type {Object}
 */

var CONFIG = require('./static/config.json');
var PLAYERS = require('./static/players.json');

/**
 * ViewAggregator class.
 * @constructor
 */
var ViewAggregator = function() {

  this._gameReports = [];
  this._leaderBoards = {
    points: [],
    wins: []
  };
  this._playerCache = {};

};

/**
 * Tells the aggregator to process a game data file as output by the log reader
 * @param {number} id The game identifier.
 * @param {Array} data An array of games actions.
 */
ViewAggregator.prototype.processGameData = function(id, data, cb) {

  var _this = this;

  var game = {
    name: id,
    scores: []
  };

  if (!data) {
    return;
  }

  data.forEach(function(action) {

    if (action.verb === CONFIG.VERBS.FINAL_SCORE) {
      game.scores.push({
        name: action.player,
        score: action.object
      });

      if (!_this._playerCache[action.player] && _this._playerCache[action.player] !== 0) {
        _this._playerCache[action.player] = parseInt(action.object);

      } else {
        _this._playerCache[action.player] += parseInt(action.object);
      }
    }

  });

  game.scores.sort(function(a, b) {
    return b.score - a.score;
  });

  this._gameReports.push(game);

  if (cb && typeof cb === 'function') {
    cb();
  }

};

/**
 * Getter for the game reports property that holds aggregated data for each game
 * provided through the processGameData method
 * @returns {Array}
 */
ViewAggregator.prototype.getGameData = function() {

  return this._gameReports;

};

/**
 * Provides an object containing data about who has won the most games out of
 * those provided
 * @returns {Object}
 */
ViewAggregator.prototype.getTotalWins = function() {

  var _this = this;
  var wins = {};

  PLAYERS.forEach(function(player) {

    _this._gameReports.forEach(function(game) {

      if (game.scores[0].name === player.name) {
        /**
         * We have a winner!
         */
        if (wins[player.name]) {
          wins[player.name]++;
        } else {
          wins[player.name] = 1;
        }

      }

    });

  });

  return wins;

};

/**
 * Aggregates the total amount of points accumulated by players across all games
 * @returns {Array}
 */
ViewAggregator.prototype.getTotalPoints = function() {

  var totals = [];

  for (var player in this._playerCache) {
    totals.push({name: player, points: this._playerCache[player]});
  }

  return totals.sort(function(a, b) {
    return b.points - a.points;
  });

};

exports.ViewAggregator = new ViewAggregator();
