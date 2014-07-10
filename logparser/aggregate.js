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

var PLAYERS = require('./static/players.json');
var EMPIRES = require('./static/empires.json');

var fs = require('fs');

var _players = {};
var _empires = {};
var _games = [];

fs.readdir(__dirname + '/' + CONFIG.OUTPUT_DIR, function(err, files) {

  if (err) {
    /**
     * Could not read directory.
     */
    console.log('Error: can\'t read directory ' + __dirname + '/' + CONFIG.OUTPUT_DIR);
    process.exit(1);
  }

  var parts = null;

  files.forEach(function(file) {

    parts = file.split('.');

    if (parts[1] && parts[1] === 'json') {
      /**
       * A JSON file in this directory is considered to be a game report.
       */



    }

  });

});



/**
 * Aggregates stats for the stats table.
 */
var _aggregateStats = function() {

  var statsTable = {};

  // highest score
  statsTable['highest_points'] = this.getHighestScores()[0].points;
  // most wins
  statsTable['average_points'] = this.getAverageScore();
  // most points
  statsTable['cards_played'] = this._cards;
  // battles
  statsTable['battles_fought'] = this._battles;

  return statsTable;

};
