/*jslint node: true */

'use strict';

/**
 * Logreader - will read a text log row by row and parse the info to
 * distributable JSON objects.
 * @type {Object}
 */

var LineParser = require('./lineparser').LineParser;
var PLAYERS = require('./static/players.json');

/**
 * Enums for determining the type of action.
 * @type {{PLAYS: RegExp, SCORED: RegExp}}
 */
var TESTS = {
  'PLAYS': new RegExp('plays'),
  'SCORED': new RegExp('scored')
};

/**
 * Main Logreader class.
 * @param {Array} file_data An array of text lines.
 * @param {function} cb A callback to be executed when the data is ready.
 * @constructor
 */
var LogReader = function(filedata, cb) {

  console.log('(logreader) init');

  if (!filedata) {
    console.log('(logreader) no file data supplied');
    return;
  }

  this._data = [];
  this._roundsPlayed = 1;
  this._currentEpoch = 1;
  this._currentPlayer = null;
  this._currentEmpire = null;

  var i = 0, l = filedata.length;

  for (; i < l; i++) {

    this.parseLogLine(filedata[i]);

  }

  if (cb && typeof cb === 'function') {

    cb(this._data);

  }

};

/**
 * Parses one single line of text data.
 * @param {string} line A text line.
 */
LogReader.prototype.parseLogLine = function(line) {

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

    console.log('(logreader) matched plays action', line);

    // valid for this entire round
    this._currentEmpire = LineParser.getEmpire();
    this._currentPlayer = LineParser.getPlayer();

    obj = {

      'player': this._currentPlayer,
      'actor': null,
      'verb': 'PLAYED_EMPIRE',
      'object': this._currentEmpire.title,
      'target': null,
      'epoch': this._currentEpoch

    };

    //console.dir(obj);

    this._data.push(obj);

  }

  /**
   * SCORE action
   * - a player has registered a score
   * - finishing action of a turn
   */
  if (TESTS.SCORED.test(line)) {

    console.log('(logreader) matched score action: ', line);

    obj = {

      'player': this._currentPlayer,
      'actor': this._currentEmpire.title,
      'verb': 'SCORED',
      'object': LineParser.extractPlayerPoints(),
      'target': null,
      'epoch': this._currentEpoch

    };

    //console.dir(obj);

    this._data.push(obj);

    if (this._currentEpoch === 6) {

      // TODO: if a player played an additional empire, it will end up here too

      obj = {

        'player': this._currentPlayer,
        'actor': this._currentEmpire.title,
        'verb': 'FINAL_SCORE',
        'object': LineParser.extractPlayerTotalPoints(),
        'target': null,
        'epoch': this._currentEpoch

      };

      this._data.push(obj);

      console.log('(logreader) matched end game final score for: ' +
          this._currentPlayer, LineParser.extractPlayerTotalPoints());

    }

    if (this._roundsPlayed % PLAYERS.length === 0) {

      this._currentEpoch++;

    }

    this._roundsPlayed++;

  }

};

exports.LogReader = LogReader;
