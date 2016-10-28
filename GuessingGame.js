function generateWinningNumber() {
  return Math.floor(Math.random() * 100 + 1);
}

function Game() {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

function newGame() {
  return new Game();
}

Game.prototype.difference = function() {
  return Math.abs(this.playersGuess - this.winningNumber);
};

Game.prototype.isLower = function() {
  return this.playersGuess < this.winningNumber;
};

Game.prototype.playersGuessSubmission = function(guess) {
  if (typeof guess !== 'number' || guess < 1 || guess > 100) {
    throw("That is an invalid guess.");
  }
  else this.playersGuess = guess;
  return this.checkGuess(guess);
};

Game.prototype.checkGuess = function(guess) {
  if (guess === this.winningNumber) {
    this.pastGuesses.push(guess);
    $('#guess-list li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess);
    $('#hint, #submit').prop('disabled', true);
    $('#subtitle').text('Hit reset to play again!');
    return "You Win!";
  }
  else if (this.pastGuesses.includes(guess)) {
    return "You have already guessed that number.";
  }
  else {
    this.pastGuesses.push(guess);
    $('#guess-list li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess);
    if (this.pastGuesses.length === 5) {
      $('#hint, #submit').prop('disabled', true);
      $('#subtitle').text('Hit reset to play again!');
      return "You Lose.";
    }
    else {
      var diff = this.difference();
      if (this.isLower()) {
        $('#subtitle').text('Guess Higher!');
      }
      else {
        $('#subtitle').text('Guess Lower!');
      }

      if (diff < 10) return 'You\'re burning up!';
      else if (diff < 25) return 'You\'re lukewarm.';
      else if (diff < 50) return 'You\'re a bit chilly.';
      else return 'You\'re ice cold!';
    }
  }
};

Game.prototype.provideHint = function() {
  return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
};

function shuffle(array) {
  var m = array.length, t, i;
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

function makeGuess(game) {
  var guess = $('#player-input').val();
  $('#player-input').val('');
  var output = game.playersGuessSubmission(+guess);
  $('#title').text(output);
}

$(document).ready(function() {
  var game = newGame();

  $('#submit').click(function() {
    makeGuess(game);
  });

  $('#player-input').keypress(function(event) {
    if (event.which === 13) {
      makeGuess(game);
    }
  });

  $('#reset').click(function() {
    game = newGame();
    $('#title').text('Play the Guessing Game!');
    $('#subtitle').text('Guess a number between 1-100!');
    $('.guess').text('-');
    $('#hint, #submit').prop('disabled', false);
  });

  $('#hint').click(function() {
    var hint = game.provideHint();
    $('#title').text('The winning number is ' + hint[0] + ', ' + hint[1] + ', or ' + hint[2]);
  });
});
