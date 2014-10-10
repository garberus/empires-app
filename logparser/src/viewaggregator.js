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
  this._battleWins = [];
  this._battleLosses = [];
  this._battles = 0;
  this._cards = 0;
  this.formCurve = [];
  this._totalFinalScore = 0;

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
  var tempPlayerIndex = -1;

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

      _this._totalFinalScore += pts;

      game.scores.push({
        name: action.player,
        score: pts
      });

      tempPlayerIndex = _this._playerInArray(action.player, _this.formCurve);

      if (tempPlayerIndex === -1) {
        _this.formCurve.push({
          name: action.player,
          form: [
            { y: pts, x: _this._gameReports.length + 1 }
          ],
          color: _this.getPlayerColor(action.player)
        });
      } else {
        _this.formCurve[tempPlayerIndex].form.push({ y: pts, x: _this._gameReports.length + 1 });
      }

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

    if (action.verb === CONFIG.VERBS.PLAYED_CARD) {
      _this._cards++;
    }

    if (action.verb === CONFIG.VERBS.BATTLE_HAPPENED) {
      _this._battles++;

      if (action.result === 'win') {
        if (!_this._battleWins[action.player] && _this._battleWins[action.player] !== 0) {
          _this._battleWins[action.player] = 1;
        } else {
          _this._battleWins[action.player]++;
        }
      } else if (action.result === 'defeat') {
        if (!_this._battleLosses[action.player] && _this._battleLosses[action.player] !== 0) {
          _this._battleLosses[action.player] = 1;
        } else {
          _this._battleLosses[action.player]++;
        }
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

  var winners = [];

  for (var player in wins) {
    winners.push({name: player, wins: wins[player], color: _this.getPlayerColor(player)});
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
    arr.push({name: player, points: obj[player], color: this.getPlayerColor(player)});
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
 * Gets the battle history
 * @returns {Array}
 */
ViewAggregator.prototype.getBattleData = function() {

  var _this = this;
  var data = [];

  PLAYERS.forEach(function(player) {

    if (_this._battleWins[player.name]) {

      data.push({
        'name': player.name,
        'wins': _this._battleWins[player.name],
        'losses': _this._battleLosses[player.name],
        'percent': Math.ceil(_this._battleWins[player.name]
          / (_this._battleWins[player.name] + _this._battleLosses[player.name])
          * 100),
        'color': player.color
      });

    }

  });

  return data.sort(function(a, b) {
    return b.wins - a.wins;
  });

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

/**
 * Retrieves the color value the player is associated with.
 * @param {string} player The name of the player.
 * @returns {*}
 */
ViewAggregator.prototype.getPlayerColor = function(player) {

  var i = 0, l = PLAYERS.length, color = null;

  for (; i < l; i++) {
    if (PLAYERS[i].name === player) color = PLAYERS[i].color;
  }

  return color;

};

/**
 * Return the number of cards played in this game.
 */
ViewAggregator.prototype.getCardsPlayed = function() {

  return this._cards;

};

/**
 * Return the number of battles fought in this game.
 */
ViewAggregator.prototype.getBattlesFought = function() {

  return this._battles;

};

/**
 * Return the average score of processed games.
 */
ViewAggregator.prototype.getAverageScore = function() {

  return Math.round(this._totalFinalScore / this._gameReports.length / 6);

};

/**
 * Return the average winning score of processed games.
 */
ViewAggregator.prototype.getAverageWinningScore = function() {

  var winning = 0;

  this._gameReports.forEach(function(game) {

    winning += game.scores[0].score;

  });

  return Math.round(winning / this._gameReports.length);

};

/**
 * Return the "form curve" - the latest 5 top scores for each player.
 */
ViewAggregator.prototype.getForm = function() {

  return this.formCurve;

};

/**
 * Finds a given player name in an array.
 * @param {string} name The player name.
 * @param {Array} arr The array to look through.
 * @returns {number} Index of found object.
 * @private
 */
ViewAggregator.prototype._playerInArray = function(name, arr) {

  var found = -1;

  arr.forEach(function(obj, index) {
    if (obj.name === name) found = index;
  });

  return found;
};

exports.ViewAggregator = new ViewAggregator();
