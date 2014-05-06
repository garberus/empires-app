#!/usr/bin/env node

'use strict';

/**
 * Looks for parsed log data in the CONFIG.OUTPUT_DIR and combines it into
 * digestible JSON data for the web app.
 * Usage:
 *        node aggregator.js
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
