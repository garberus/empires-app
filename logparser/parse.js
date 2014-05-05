#!/usr/bin/env node

'use strict';

var Reader = require('./src/logreader').LogReader;
var fs = require('fs');

var _reader = null;
var _filename = null;

var OUTPUT_DIR = 'output';

/**
 * If insufficient number of arguments are passed to the parser, let the user know.
 */
if (process.argv.length < 3) {

  console.log('Usage: node ' + process.argv[1] + ' <FILENAME>');

  process.exit(1);

}

/**
 * If the parser is given a filename - go ahead and parse it.
 */
fs.exists(process.argv[2], function(exists) {

  if (exists) {

    _readFile(process.argv[2]);

  } else {

    /**
     * No file with that name was found.
     */
    console.log('Error: can\'t find file with filename ' + process.argv[2]);
    process.exit(1);

  }

});

/**
 * Tries to read a file.
 * @param {string} filename The filename.
 * @private
 */
var _readFile = function _readFile(filename) {

  fs.readFile(filename, function(err, data) {

    if(err) throw err;

    _filename = filename.split('/')[1].split('.')[0];

    _reader = new Reader(data.toString().split("\n"), _checkDirectory);

  });

};

/**
 * Looks for the OUTPUT_DIRECTORY. If not found, this is created before
 * moving on
 * @param {Object} data Data in the shape of JSON.
 * @private
 */
var _checkDirectory = function _checkDirectory(data) {

  fs.exists(__dirname + '/' + OUTPUT_DIR + '/', function(exists) {

    if (exists) {

      _printData(data);

    } else {

      fs.mkdir(__dirname + '/' + OUTPUT_DIR + '/', function(err) {

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

  var jsonfile = __dirname + '/' + OUTPUT_DIR + '/' + _filename + '.json';

  fs.writeFile(jsonfile, JSON.stringify(data), function (err) {

    if (err) throw err;

    console.log('File written ' + jsonfile);

  });

};

