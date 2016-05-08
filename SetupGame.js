function SetupGame() {
  this.answer = [0,1,2,3];
  this.randomiseAnswer();
}

SetupGame.prototype.randomiseAnswer = function() {
  this.answer = shuffle(this.answer);
};

function shuffle(o) {
  for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};

module.exports = SetupGame;
