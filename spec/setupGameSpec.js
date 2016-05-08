describe("SetupGame", function() {
  var SetupGame = require('../SetupGame');
  var game;

  beforeEach(function() {
    game = new SetupGame();
  });

  describe("randomized correct answer", function(){

    it("should contains 0, 1, 2 and 3", function() {
      expect(game.answer).toContain(0);
      expect(game.answer).toContain(1);
      expect(game.answer).toContain(2);
      expect(game.answer).toContain(3);
    });

    it("should contains only 4 values", function() {
      expect(game.answer.length).toEqual(4);
    });

    it("should return a randomized answer", function(){
      spyOn(Math, "random").and.returnValue(0.5);
      game = new SetupGame();
      expect(game.answer).toEqual([0, 3, 1, 2]);
    });
  });
});
