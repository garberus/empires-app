/*jslint node: true*/

'use strict';

var expect = require('expectacle');
var Parser = require('../src/lineparser.js').LineParser;

describe('LineParser', function() {

  describe('parsing play action', function() {

    var line = '42.	Henrik plays The Shang Dynasty.';

    it('should return the player', function() {
      Parser.setLine(line);
      expect(Parser.getPlayer()).toBe('Henrik');
    });

    it('should return the empire being played', function() {
      Parser.setLine(line);
      expect(Parser.getEmpire().title).toBe('The Shang Dynasty');
    });

  });

  describe('parsing score action', function() {

    var line = '72.	Henrik scored 17 pts this epoch. Total: 21';

    it('should return the player', function() {
      Parser.setLine(line);
      expect(Parser.getPlayer()).toBe('Henrik');
    });

    it('should return the score for this round', function() {
      Parser.setLine(line);
      expect(Parser.extractPlayerPoints()).toBe('17');
    });

  });

  describe('parsing total score', function() {

    var line = '593.	Henrik scored 57 pts this epoch. Total: 183';

    it('should return the total score', function() {
      Parser.setLine(line);
      expect(Parser.extractPlayerTotalPoints()).toBe('183');
    });

  });

});
