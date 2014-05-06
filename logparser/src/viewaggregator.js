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
  this._totalCache = {};
  this._highScoreCache = {};

};

/**
 * Tells the aggregator to process a game data file as output by the log reader
 * @param {number} id The game identifier.
 * @param {Array} data An array of games actions.
 */
ViewAggregator.prototype.processGameData = function(id, data, cb) {

  var _this = this;

  var pts = 0;

  var game = {
    name: id,
    scores: []
  };

  if (!data) {
    return;
  }

  data.forEach(function(action) {

    if (action.verb === CONFIG.VERBS.FINAL_SCORE) {

      pts = parseInt(action.object);

      game.scores.push({
        name: action.player,
        score: pts
      });

      if (!_this._totalCache[action.player] && _this._totalCache[action.player] !== 0) {
        _this._totalCache[action.player] = pts;

      } else {
        _this._totalCache[action.player] += pts;
      }

      _this._highScoreCache[action.player] = pts > (_this._highScoreCache[action.player] || 0)
          ? pts : (_this._highScoreCache[action.player] || 0);
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

  var winners = [];

  for (var player in wins) {
    winners.push({name: player, wins: wins[player]});
  }

  return winners.sort(function(a, b) {
    return b.wins - a.wins;
  });

};

/**
 * Aggregates the total amount of points accumulated by players across all games
 * @returns {Array}
 */
ViewAggregator.prototype.getTotalPoints = function() {

  var totals = [];

  for (var player in this._totalCache) {
    totals.push({name: player, points: this._totalCache[player]});
  }

  return totals.sort(function(a, b) {
    return b.points - a.points;
  });

};

/**
 * Finds the gighest scores for a user
 * @returns {Array}
 */
ViewAggregator.prototype.getHighestScores = function() {

  var scores = [];

  for (var player in this._highScoreCache) {
    scores.push({name: player, points: this._highScoreCache[player]});
  }

  return scores.sort(function(a, b) {
    return b.points - a.points;
  });

};

exports.ViewAggregator = new ViewAggregator();
