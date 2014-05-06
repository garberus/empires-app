/*jslint node: true*/

'use strict';

var expect = require('expectacle');
var ViewAggregator = require('../logparser/src/viewaggregator.js').ViewAggregator;

var game1 = [
  {
    "player": "Jon ",
    "actor": null,
    "verb": 2,
    "object": "The Manchu Dynasty",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Jon ",
    "actor": "The Manchu Dynasty",
    "verb": 1,
    "object": "35",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Jon ",
    "actor": "The Manchu Dynasty",
    "verb": 4,
    "object": "163",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Henrik",
    "actor": null,
    "verb": 2,
    "object": "Netherlands",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Henrik",
    "actor": "Netherlands",
    "verb": 1,
    "object": "63",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Henrik",
    "actor": "Netherlands",
    "verb": 4,
    "object": "203",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Johan",
    "actor": null,
    "verb": 2,
    "object": "France",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Johan",
    "actor": "France",
    "verb": 1,
    "object": "44",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Johan",
    "actor": "France",
    "verb": 4,
    "object": "170",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Jonas",
    "actor": null,
    "verb": 2,
    "object": "Britain",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Jonas",
    "actor": "Britain",
    "verb": 1,
    "object": "55",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Jonas",
    "actor": "Britain",
    "verb": 4,
    "object": "177",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Gustav",
    "actor": null,
    "verb": 2,
    "object": "The United States",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Gustav",
    "actor": "The United States",
    "verb": 1,
    "object": "36",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Gustav",
    "actor": "The United States",
    "verb": 4,
    "object": "168",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Pontus",
    "actor": null,
    "verb": 2,
    "object": "Germany",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Pontus",
    "actor": "Germany",
    "verb": 1,
    "object": "46",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Pontus",
    "actor": "Germany",
    "verb": 4,
    "object": "192",
    "target": null,
    "epoch": 7
  }
];
var game2 = [
  {
    "player": "Jonas",
    "actor": null,
    "verb": 2,
    "object": "Russia",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Jonas",
    "actor": "Russia",
    "verb": 1,
    "object": "64",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Jonas",
    "actor": "Russia",
    "verb": 4,
    "object": "190",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Gustav",
    "actor": null,
    "verb": 2,
    "object": "The Manchu Dynasty",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Gustav",
    "actor": "The Manchu Dynasty",
    "verb": 1,
    "object": "39",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Gustav",
    "actor": "The Manchu Dynasty",
    "verb": 4,
    "object": "176",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Jon ",
    "actor": null,
    "verb": 2,
    "object": "Netherlands",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Jon ",
    "actor": "Netherlands",
    "verb": 1,
    "object": "36",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Jon ",
    "actor": "Netherlands",
    "verb": 4,
    "object": "158",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Johan",
    "actor": null,
    "verb": 2,
    "object": "Britain",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Johan",
    "actor": "Britain",
    "verb": 1,
    "object": "54",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Johan",
    "actor": "Britain",
    "verb": 4,
    "object": "189",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Henrik",
    "actor": null,
    "verb": 2,
    "object": "The United States",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Henrik",
    "actor": "The United States",
    "verb": 1,
    "object": "46",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Henrik",
    "actor": "The United States",
    "verb": 4,
    "object": "199",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Pontus",
    "actor": null,
    "verb": 2,
    "object": "Germany",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Pontus",
    "actor": "Germany",
    "verb": 1,
    "object": "38",
    "target": null,
    "epoch": 7
  },
  {
    "player": "Pontus",
    "actor": "Germany",
    "verb": 4,
    "object": "166",
    "target": null,
    "epoch": 7
  }
];

ViewAggregator.processGameData('game_1', game1);
ViewAggregator.processGameData('game_2', game2);

describe('ViewAggregator', function() {

  describe('listing games', function() {

    it('should set an identifier of a game', function() {
      expect(ViewAggregator.getGameData()[0].name).toBe('game_1');
    });

    it('should return an array of two games from supplied test data', function() {
      expect(ViewAggregator.getGameData()).toBeArray();
      expect(ViewAggregator.getGameData().length).toBe(2);
    });

  });

  describe('player scores', function() {

    it('should correctly report the winner of game 1', function() {
      expect(ViewAggregator.getGameData()[0].scores[0].name).toBe('Henrik');
      expect(ViewAggregator.getGameData()[0].scores[0].score).toBe(203);
    });

    it('should correctly report the player who won the most games', function() {
      expect(Object.keys(ViewAggregator.getTotalWins()).length).toBe(1);
      expect(ViewAggregator.getTotalWins()[0].wins).toBe(2);
    });

    it('should correctly report the player with most points', function() {
      expect(ViewAggregator.getTotalPoints()[0].name).toBe('Henrik');
      expect(ViewAggregator.getTotalPoints()[0].points).toBe(402);
    });

    it('should correctly report the player with the second most points', function() {
      expect(ViewAggregator.getTotalPoints()[1].name).toBe('Jonas');
      expect(ViewAggregator.getTotalPoints()[1].points).toBe(367);
    });

    it('should correctly report the highest points in a game', function() {
      expect(ViewAggregator.getHighestScores()).toBeArray();
      expect(ViewAggregator.getHighestScores().length).toBe(6);
      expect(ViewAggregator.getHighestScores()[0].name).toBe('Henrik');
      expect(ViewAggregator.getHighestScores()[0].points).toBe(203);
      expect(ViewAggregator.getHighestScores()[1].name).toBe('Pontus');
      expect(ViewAggregator.getHighestScores()[1].points).toBe(192);
    });

  });

});
