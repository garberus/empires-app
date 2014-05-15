/*jslint node: true*/

'use strict';

var expect = require('expectacle');
var ViewAggregator = require('../logparser/src/viewaggregator.js').ViewAggregator;

var game1 = require('./testdata_19');
var game2 = require('./testdata_20');

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
      expect(ViewAggregator.getGameData()[0].scores[0].name).toBe('Pontus');
      expect(ViewAggregator.getGameData()[0].scores[0].score).toBe(189);
    });

    it('should correctly report the player who won the most games', function() {
      expect(Object.keys(ViewAggregator.getTotalWins()).length).toBe(2);
      expect(ViewAggregator.getTotalWins()[0].wins).toBe(1);
    });

    it('should correctly report the player with most points', function() {
      expect(ViewAggregator.getTotalPoints()[0].name).toBe('Pontus');
      expect(ViewAggregator.getTotalPoints()[0].points).toBe(373);
    });

    it('should correctly report the player with the second most points', function() {
      expect(ViewAggregator.getTotalPoints()[1].name).toBe('Jonas');
      expect(ViewAggregator.getTotalPoints()[1].points).toBe(360);
    });

    it('should correctly report the highest points in a game', function() {
      expect(ViewAggregator.getHighestScores()).toBeArray();
      expect(ViewAggregator.getHighestScores().length).toBe(6);
      expect(ViewAggregator.getHighestScores()[0].name).toBe('Pontus');
      expect(ViewAggregator.getHighestScores()[0].points).toBe(189);
      expect(ViewAggregator.getHighestScores()[1].name).toBe('Jonas');
      expect(ViewAggregator.getHighestScores()[1].points).toBe(185);
    });

  });

  describe('epoch stats', function() {

    it('should report the top scores for each epoch', function() {
      var all = ViewAggregator.getScoreForEpoch();
      expect(all).toBeArray();
      expect(all.length).toBe(7);
    });

    it('should report the correct top and bottom scores for a single epoch', function() {
      var epoch5 = ViewAggregator.getScoreForEpoch(4); // epoch 5
      expect(epoch5).toBeObject();
      expect(epoch5.top.score).toBe(38);
      expect(epoch5.top.player).toBe('Henrik');
      expect(epoch5.low.score).toBe(18);
      expect(epoch5.low.player).toBe('Henrik');
    })

  });

});
