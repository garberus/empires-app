#!/usr/bin/env node

'use strict';

/**
 * Looks for parsed log data in the CONFIG.OUTPUT_DIR and combines it into
 * digestible JSON data for the web app.
 * Usage:
 *        node aggregator.js
 * Data needed:
 *  - Version 1
 *    Summaries of: max score (avg score), total cards played, max winning score
 *    Per player: max score, total wins, total score, won battles, score per game
 */

var CONFIG = require('./src/static/config.json');

var PLAYERS = require('./src/static/players.json');
var EMPIRES = require('./src/static/empires.json');

var ViewAggregator = require('./src/viewaggregator').ViewAggregator;

var fs = require('fs');

var _filesToRead = 0;
var _filesRead = 0;

var _players = {};
var _empires = {};
var _games = [];
var _data = [];

fs.readdir(__dirname + '/' + CONFIG.OUTPUT_DIR, function(err, files) {

  if (err) {
    /**
     * Could not read directory.
     */
    console.log('Error: can\'t read directory ' + __dirname + '/' + CONFIG.OUTPUT_DIR);
    process.exit(1);
  }

  var parts = null;

  _filesToRead = files.length;

  console.log('Directory ' + __dirname + '/' + CONFIG.OUTPUT_DIR +
    ' contains ' + _filesToRead + ' files.');

  files.forEach(function(file) {

    console.log('Reading ' + file);

    parts = file.split('.');

    if (parts[1] && parts[1] === 'json') {
      /**
       * A JSON file in this directory is considered to be a game report.
       */
      _readFile(__dirname + '/' + CONFIG.OUTPUT_DIR + '/' + file);

    }

  });

});

/**
 * Tries to read a file.
 * @param {string} file The file.
 * @private
 */
var _readFile = function _readFile(file) {

  fs.readFile(file, function(err, data) {

    if (err) throw err;

    var parts = file.split('/');
    var filename = parts[parts.length - 1].split('.')[0];

    ViewAggregator.processGameData(filename, JSON.parse(data));

    _filesRead++;

    if (_filesRead === _filesToRead) {
      _combineData();
    }

  });

};

/**
 * When all data is in the Aggregator, combine it to a JSON structure that
 * the dataService in the front-end can read.
 * @private
 */
var _combineData = function _combineData() {

  var dataObject = [];

  // Games played
  dataObject.push({'games_played': ViewAggregator.getGameData().length});

  // Highest points
  dataObject.push({'highest_scores': ViewAggregator.getHighestScores()[0].points});

  // Average points
  dataObject.push({'average_points': ViewAggregator.getAverageScore()});

  // Cards played
  dataObject.push({'cards_played': ViewAggregator.getCardsPlayed()});

  // Battles fought
  dataObject.push({'battles_fought': ViewAggregator.getBattlesFought()});

  // Most wins
  dataObject.push({'most_wins': ViewAggregator.getTotalWins()});

  // Most points
  dataObject.push({'most_points': ViewAggregator.getTotalPoints()});

  // Most battles won
  dataObject.push({'battle_data': ViewAggregator.getBattleData()});

  // Most points in a game
  dataObject.push({'most_points_game': ViewAggregator.getHighestScores()});

  // Form
  dataObject.push({'form': ViewAggregator.getForm()});

  _checkDirectory(dataObject);
};

/**
 * Looks for the DATA_DIR. If not found, this is created before
 * moving on
 * @param {Object} data Data in the shape of JSON.
 * @private
 */
var _checkDirectory = function _checkDirectory(data) {

  fs.exists(__dirname + '/' + CONFIG.DATA_DIR + '/', function(exists) {

    if (exists) {

      _printData(data);

    } else {

      fs.mkdir(__dirname + '/' + CONFIG.DATA_DIR + '/', function(err) {

        if (err) throw err;

        _printData(data);

      });
    }
  });

};

/**
 * Saves data as a JSON file.
 * @param {Object} data Data in the shape of JSON.
 * @private
 */
var _printData = function _printData(data) {

  var jsonfile = __dirname + '/' + CONFIG.DATA_DIR + '/' + CONFIG.DATA_FILE_NAME + '.json';

  fs.writeFile(jsonfile, JSON.stringify(data), function(err) {

    if (err) throw err;

    console.log('File written ' + jsonfile);

  });

};
