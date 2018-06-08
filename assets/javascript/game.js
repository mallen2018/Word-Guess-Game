// World List for random selections for words in play with hints provided after separator/
var pickWord = [
    "lollipop/Tasty Suckers", 
    "chocolate/Cocoa",
    "pie/Sometimes Apple",
    "cake/Birthday",
    "gummybears/Not Worms",
    "icecream/Cold and yummy",
    "jello/Jiggly",
    "pudding/Squishy",
    "jellybeans/Not rice and ..."
  ];

//List of variables built up to call later//
// Maximum number of tries player has
const maxTries = 10;          
// Stores the letters the user guessed
var guessedLetters = []; 
// Index of the current word in the array
var currentWordIndex; 
// This will be the word we actually build to match the current word          
var wordinplay = [];     
// How many tries the player has left     
var remainingGuesses = 0;  
// Flag to tell if the game has started     
var gameStarted = false;  
// Flag for 'press any key to try again'         
var hasFinished = false; 
// How many wins has the player racked up    
var wins = 0;  

// Game sounds
var keySound = new Audio('./assets/sounds/starsounds.wav');
var winSound = new Audio('./assets/sounds/winner.wav');
var loseSound = new Audio('./assets/sounds/you-lose.wav');

//function to get hint after character in word array
function gethint(str) {
    return str.split('/')[1];
}

//function to get currentword index before character in word array --need to finish working on this
function getwordinplay(str) {
    return str.substring(0, str.indexOf("/")); 
}

// When you click the button the game picks a word and displays hint for the word under button
$(document).ready(function() {
    $("#random-button").on("click",function() {
    var wordinplay = pickWord[Math.floor(Math.random()* pickWord.length)];
    $("#wordinplay").text(gethint(wordinplay))
     });
});

 // Reset game variables
function resetGame() {
remainingGuesses = maxTries;
currentWordIndex = Math.floor(Math.random() * (pickWord.length));
guessedLetters = [];
wordinplay = [];
document.getElementById("hangmanImage").src = "";
for (var i = 0; i < pickWord[currentWordIndex].length; i++) {
wordinplay.push("_");
}   

// Show display
updateDisplay();
};

// show how much of word was guessed
function updateDisplay() {
document.getElementById("totalWins").innerText = wins; 
var wordinplayText = "";
for (var i = 0; i < wordinplay.length; i++) {
wordinplayText += wordinplay[i];
}
document.getElementById("currentWord").innerText = wordinplayText;
document.getElementById("remainingGuesses").innerText = remainingGuesses;
document.getElementById("guessedLetters").innerText = guessedLetters;
};


// Updates the image depending on how many guesses
function updateHangmanImage() {
    document.getElementById("hangmanImage").src = "assets/images/" + (maxTries - remainingGuesses) + ".png";
};

// This function takes a letter and finds all instances of 
// appearance in the string and replaces them in the guess word.
function evaluateGuess(letter) {
    // Array to store positions of letters in string
    var positions = [];

    // Loop through word finding all instances of guessed letter, store the indicies in an array.
    for (var i = 0; i < pickWord[currentWordIndex].length; i++) {
        if(pickWord[currentWordIndex][i] === letter) {
            positions.push(i);
        }
    }

    // if there are no indicies, remove a guess and update the hangman image
    if (positions.length <= 0) {
        remainingGuesses--;
        updateHangmanImage();
    } else {
        // Loop through all the indicies and replace the '_' with a letter.
        for(var i = 0; i < positions.length; i++) {
            wordinplay[positions[i]] = letter;
        }
    }
};
// Checks for a win by seeing if there are any remaining underscores in the wordinplay we are building.
function checkWin() {
    if(wordinplay.indexOf("_") === -1) {
        document.getElementById("youwin-image").style.cssText = "display: block";
        document.getElementById("pressKeyTryAgain").style.cssText= "display: block";
        wins++;
        winSound.play();
        hasFinished = true;
    }
};


// Checks for a loss
function checkLoss()
{
    if(remainingGuesses <= 0) {
        loseSound.play();
        document.getElementById("gameover-image").style.cssText = "display: block";
        document.getElementById("pressKeyTryAgain").style.cssText = "display:block";
        hasFinished = true;
    }
}

// Makes a guess
function makeGuess(letter) {
    if (remainingGuesses > 0) {
        // Make sure we didn't use this letter yet
        if (guessedLetters.indexOf(letter) === -1) {
            guessedLetters.push(letter);
            evaluateGuess(letter);
        }
    }
    
};


// Event listener
document.onkeydown = function(event) {
    // If we finished a game, dump one keystroke and reset.
    if(hasFinished) {
        resetGame();
        hasFinished = false;
    } else {
        // Check to make sure a-z was pressed.
        if(event.keyCode >= 65 && event.keyCode <= 90) {
            keySound.play();
            makeGuess(event.key.toUpperCase());
            updateDisplay();
            checkWin();
            checkLoss();
        }
    }
};