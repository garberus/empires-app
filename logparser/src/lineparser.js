/*jslint node: true */

'use strict';

var PLAYERS = require('./static/players.json');
var EMPIRES = require('./static/empires.json');

var LineParser = function() {

  this._init();

};

LineParser.prototype._init = function _init() {

  this._line = '';
  this._players = [];
  this._empires = [];

};

LineParser.prototype._setEmpireArray = function _setEmpireArray() {

  var i = 0, l = EMPIRES.length;

  for (; i < l; i++) {

    if (this._line.indexOf(EMPIRES[i].title) > -1) {

      this._empires[this._line.indexOf(EMPIRES[i].title)] = EMPIRES[i];

    }

    if (this._line.indexOf(EMPIRES[i].name) > -1) {

      this._empires[this._line.indexOf(EMPIRES[i].name)] = EMPIRES[i];

    }

  }

  this._empires = this._squashArray(this._empires);

};

LineParser.prototype._setPlayerArray = function _setPlayerArray() {

  var i = 0, l = PLAYERS.length;

  for (; i < l; i++) {

    if (this._line.indexOf(PLAYERS[i].name) > -1) {

      this._players[this._line.indexOf(PLAYERS[i].name)] = PLAYERS[i].name;

    }

  }

  this._players = this._squashArray(this._players);

};

LineParser.prototype._squashArray = function _squashArray(arr) {

  var i = 0, l = arr.length, squashed = [];

  for (; i < l; i++) {

    if (arr[i]) {

      squashed.push(arr[i]);

    }
  }

  return squashed;

};


LineParser.prototype.setLine = function setLine(line) {

  this._init();

  this._line = line;
  this._setPlayerArray();
  this._setEmpireArray();

};

LineParser.prototype.getPlayer = function getPlayer(index) {

  return this._players[index || 0];

};

LineParser.prototype.getEmpire = function getEmpire(index) {

  return this._empires[index || 0];

};

LineParser.prototype.extractPlayerPoints = function extractPlayerPoints() {

  var player = this.getPlayer().trim();
  var scored = player + ' scored ';
  return this._line.substring(this._line.indexOf(scored) + scored.length,
    this._line.indexOf(' pts'));

};

LineParser.prototype.extractPlayerTotalPoints = function extractPlayerTotalPoints() {

  var total = 'Total: ';
  return this._line.substring(this._line.indexOf(total) + total.length,
    this._line.length);

};


exports.LineParser = new LineParser();
