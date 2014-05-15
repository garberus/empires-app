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
      expect(Parser.getEmpires()[0].title).toBe('The Indus Valley Civilization');
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

  describe('parsing battle action', function() {

    var victory = 'The Macedonians defeated the Phoenicians and occupied Levant';
    var defeat = 'The Macedonians were defeated in Persian Plateau by the Persians';
    var draw = 'The Macedonians and the Sumerians destroyed each other in Zagros';

    describe('victory', function() {

      it('should return the acting Empire', function() {
        Parser.setLine(victory);
        expect(Parser.getEmpires()[0].title).toBe('Macedonia');
      });

      it('should return the passive Empire', function() {
        Parser.setLine(victory);
        expect(Parser.getEmpires()[1].title).toBe('Phoenicia');
      });

    });

    describe('defeat', function() {

      it('should return the acting Empire', function() {
        Parser.setLine(defeat);
        expect(Parser.getEmpires()[0].title).toBe('Macedonia');
      });

      it('should return the passive Empire', function() {
        Parser.setLine(defeat);
        expect(Parser.getEmpires()[1].title).toBe('Persia');
      });

    });

    describe('draw', function() {

      it('should return the acting Empire', function() {
        Parser.setLine(draw);
        expect(Parser.getEmpires()[0].title).toBe('Macedonia');
      });

      it('should return the passive Empire', function() {
        Parser.setLine(draw);
        expect(Parser.getEmpires()[1].title).toBe('Sumeria');
      });

    });

    describe('rebels', function() {

      var rebellost = 'The Rebel Vedic were defeated in Upper Indus by the Vedic';
      var rebelwin = '101.	The Rebel Egyptians defeated the Egyptians and occupied Nubia';

      describe('victory', function() {

        it('should return the acting Empire', function() {
          Parser.setLine(rebelwin);
          expect(Parser.getEmpires()[0].title).toBe('Egyptian Rebels');
        });

        it('should return the passive Empire', function() {
          Parser.setLine(rebelwin);
          expect(Parser.getEmpires()[1].title).toBe('Egypt');
        });

      });

      describe('defeat', function() {

        it('should return the acting Empire', function() {
          Parser.setLine(rebellost);
          expect(Parser.getEmpires()[0].title).toBe('Vedic Rebels');
        });

        it('should return the passive Empire', function() {
          Parser.setLine(rebellost);
          expect(Parser.getEmpires()[1].title).toBe('The Vedic City States');
        });

      });

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
