/*jslint node: true */

'use strict';

/**
 * Logreader - will read a text log row by row and parse the info to
 * distributable JSON objects.
 * @type {Object}
 */

var CONFIG = require('./static/config.json');
var LineParser = require('./lineparser').LineParser;

/**
 * Enums for determining the type of action.
 * @type {{PLAYS: RegExp, SCORED: RegExp}}
 */
var TESTS = {
  'PLAYS': new RegExp('plays'),
  'SCORED': new RegExp('scored'),
  'BATTLE': new RegExp('defeated'), // both defeated and was defeated is a battle
  'DESTROYED': new RegExp('destroyed each other')
};

/**
 * Main Logreader class.
 * @param {Array} filedata An array of text lines.
 * @param {function} cb A callback to be executed when the data is ready.
 * @constructor
 */
var LogReader = function(filedata, cb) {

  if (!filedata) {
    console.log('(LogReader) no file data supplied');
    return;
  }

  this._data = [];
  this._roundsPlayed = 1;
  this._currentEpoch = 1;
  this._currentPlayer = null;
  this._currentEmpire = null;
  this._players = [];

  var i = 0, l = filedata.length, begin = false;

  for (; i < l; i++) {

    // index 0 will be the name of the game
    // the following will be player names until the row that starts with '0'
    if (i > 0 && !begin) {
      begin = (filedata[i].charAt(0) === '0');
      if (!begin) this._players.push(filedata[i]);
    } else {
      this.parseLogLine(i, filedata[i]);
    }

  }

  if (cb && typeof cb === 'function') {

    cb(this._data);

  }

};

/**
 * Parses one single line of text data.
 * @param {string} line A text line.
 */
LogReader.prototype.parseLogLine = function(index, line) {

  if (!line) {
    return;
  }

  var obj = null;

  LineParser.setLine(line);

  /**
   * PLAYS action
   * - a player has played a card
   * - opening action of a new turn
   */
  if (TESTS.PLAYS.test(line)) {

    //console.log('(LogReader) matched plays action', line);

    // valid for this entire round
    this._currentEmpire = LineParser.getEmpire();
    this._currentPlayer = LineParser.getPlayer();

    var cards = LineParser.getCards();
    var _this = this;

    obj = {

      'player': this._currentPlayer,
      'actor': null,
      'verb': CONFIG.VERBS.PLAYED_EMPIRE,
      'object': this._currentEmpire.title,
      'target': null,
      'epoch': this._currentEpoch

    };

    this._data.push(obj);

    if (cards.length) {

      cards.forEach(function(card) {

        obj = {

          'player': _this._currentPlayer,
          'actor': _this._currentEmpire.title,
          'verb': CONFIG.VERBS.PLAYED_CARD,
          'object': card,
          'target': null,
          'epoch': _this._currentEpoch

        };

        _this._data.push(obj);

      });

    }

  }

  /**
   * BATTLE action
   * - a 'defeated', 'was defeated' or 'destroyed each other' line was found
   */
  if (TESTS.BATTLE.test(line) || TESTS.DESTROYED.test(line)) {

    //console.log('(LogReader) matched battle action', line);

    obj = {

      'player': this._currentPlayer,
      'actor': null,
      'verb': CONFIG.VERBS.BATTLE_HAPPENED,
      'object': this._currentEmpire.title,
      'target': null,
      'epoch': this._currentEpoch

    };

    this._data.push(obj);

  }

  /**
   * SCORE action
   * - a player has registered a score
   * - finishing action of a turn
   */
  if (TESTS.SCORED.test(line)) {

    //console.log('(LogReader) matched score action: ', line);

    obj = {

      'player': this._currentPlayer,
      'actor': this._currentEmpire.title,
      'verb': CONFIG.VERBS.SCORED,
      'object': LineParser.extractPlayerPoints(),
      'target': null,
      'epoch': this._currentEpoch

    };

    this._data.push(obj);

    if (this._currentEpoch === 7) {

      // TODO: if a player played an additional empire, it will end up here too
      // this is probably fine

      obj = {

        'player': this._currentPlayer,
        'actor': this._currentEmpire.title,
        'verb': CONFIG.VERBS.FINAL_SCORE,
        'object': LineParser.extractPlayerTotalPoints(),
        'target': null,
        'epoch': this._currentEpoch

      };

      this._data.push(obj);

      //console.log('(LogReader) matched end game final score for: ' +
      //    this._currentPlayer, LineParser.extractPlayerTotalPoints());

    }

    if (this._roundsPlayed % this._players.length === 0) {

      this._currentEpoch++;

    }

    this._roundsPlayed++;

  }

};

exports.LogReader = LogReader;
