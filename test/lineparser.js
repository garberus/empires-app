/*jslint node: true*/

'use strict';

var expect = require('expectacle');
var Parser = require('../logparser/src/lineparser.js').LineParser;

describe('LineParser', function() {

  describe('parsing play action', function() {

    var line = '34.	Henrik plays The Indus Valley Civilization with the Disaster card and the Civil Service card.';

    it('should return the player', function() {
      Parser.setLine(line);
      expect(Parser.getPlayer()).toBe('Henrik');
    });

    it('should return the empire being played', function() {
      Parser.setLine(line);
      expect(Parser.getEmpire().title).toBe('The Indus Valley Civilization');
    });

    it('should return the number of cards played', function() {
      Parser.setLine(line);
      expect(Parser.getCards().length).toBe(2);
    });

    it('should return the second card as "Civil Service"', function() {
      Parser.setLine(line);
      expect(Parser.getCards()[1]).toBe('Civil Service');
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
