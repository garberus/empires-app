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
  this._epochCache = [];

};

/**
 * Tells the aggregator to process a game data file as output by the log reader
 * @param {number} id The game identifier.
 * @param {Array} data An array of games actions.
 */
ViewAggregator.prototype.processGameData = function(id, data, cb) {

  var _this = this;

  var pts = 0;
  var currentEpoch = 0;
  var epochData = null;

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

    if (action.verb === CONFIG.VERBS.SCORED) {

      pts = parseInt(action.object);

      currentEpoch = action.epoch - 1;

      epochData = _this._epochCache[currentEpoch];

      if (!epochData) {
        epochData = {
          top: {
            score: pts,
            player: action.player
          },
          low: {
            score: pts,
            player: action.player
          },
          total: pts
        };
      } else {
        if (pts > epochData.top.score) {
          epochData.top.score = pts;
          epochData.top.player = action.player;
        }
        if (pts < epochData.low.score) {
          epochData.low.score = pts;
          epochData.low.player = action.player;
        }
        epochData.total += pts;
      }

      _this._epochCache[currentEpoch] = epochData;

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
 * Utility function to convert an object to a sorted array.
 * @param obj The object to be converted.
 * @returns {Array}
 * @private
 */
ViewAggregator.prototype._convertObjectAndSort = function(obj) {

  var arr = [];

  for (var player in obj) {
    arr.push({name: player, points: obj[player]});
  }

  return arr.sort(function(a, b) {
    return b.points - a.points;
  });

};

/**
 * Aggregates the total amount of points accumulated by players across all games
 * @returns {Array}
 */
ViewAggregator.prototype.getTotalPoints = function() {

  return this._convertObjectAndSort(this._totalCache);

};

/**
 * Finds the highest scores for a user
 * @returns {Array}
 */
ViewAggregator.prototype.getHighestScores = function() {

  return this._convertObjectAndSort(this._highScoreCache);

};

/**
 * Finds the highest and lowest scores for an epoch
 * @param {number} index The game identifier.
 * @returns {*}
 */
ViewAggregator.prototype.getScoreForEpoch = function(index) {

  if (index) {
    return this._epochCache[index];
  } else {
    return this._epochCache;
  }

};

exports.ViewAggregator = new ViewAggregator();
