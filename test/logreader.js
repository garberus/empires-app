/*jslint node: true*/

'use strict';

var expect = require('expectacle');
var LogReader = require('../logparser/src/logreader.js').LogReader;

var sample = [
  'Sample log',
  'Eric',
  'Henrik',
  '0.	Epoch 1 - 3000BC - Dawn of History',
  '7.	Eric plays Sumeria with the Engineering card.',
  '23.	Henrik scored 8 pts this epoch. Total: 8',
  '68.	The Assyrians were defeated in East Anatolia by the Hittites',
  '97.	The Phoenicians defeated the Assyrians and occupied Upper Tigris',
  '596.	Eric scored 39 pts this epoch. Total: 180'
];

describe('LogReader', function() {

  describe('should be initialised with an array and a callback', function() {

    it('should initiate properly and fire the callback', function(done) {
      new LogReader(sample, function() {
        done();
      });
    });

    it('should return an array of data', function(done) {
      new LogReader(sample, function(data) {
        expect(data).toBeArray();
        done();
      });
    });

    it('the array of known actions should be 5', function(done) {
      new LogReader(sample, function(data) {
        expect(data.length).toBe(6);
        done();
      });
    });

  });

});
