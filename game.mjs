import * as readlinePromises from "node:readline/promises";
const rl = readlinePromises.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function askQuestion(question) {
  return await rl.question(question);
}

import { ANSI } from "./ansi.mjs";
import { HANGMAN_UI } from "./graphics.mjs";

const wordList = ["Helen", "Sambuca", "Spitfire"];
const correctWord =
  wordList[Math.floor(Math.random() * wordList.length)].toLowerCase();
const numberOfCharInWord = correctWord.length;
let guessedWord = "".padStart(correctWord.length, "_");
let wordDisplay = "";
let playAgain = true;
let isGameOver = false;
let wasGuessCorrect = false;
let wrongGuesses = [];
let triedLetters = [];
let similarGuess = false;
let totalAttempts = 0;

const greenColor = ANSI.COLOR.GREEN;
const colorReset = ANSI.RESET;

function drawWordDisplay() {
  wordDisplay = "";

  for (let i = 0; i < numberOfCharInWord; i++) {
    if (guessedWord[i] != "_") {
      wordDisplay += greenColor;
    }
    wordDisplay = wordDisplay + guessedWord[i] + " ";
    wordDisplay += colorReset;
  }

  return wordDisplay;
}

function drawList(list, color) {
  let output = color;
  for (let i = 0; i < list.length; i++) {
    output += list[i] + " ";
  }

  return output + colorReset;
}

while (isGameOver == false) {
  totalAttempts += 1;

  console.log(ANSI.CLEAR_SCREEN);
  console.log(drawWordDisplay());
  console.log(drawList(wrongGuesses, ANSI.COLOR.RED));
  console.log(HANGMAN_UI[wrongGuesses.length]);

  const answer = (
    await askQuestion("Guess a char or the word : ")
  ).toLowerCase();

  if (answer == correctWord) {
    isGameOver = true;
    wasGuessCorrect = true;
  } else if (answer.length == 1) {
    if (triedLetters.includes(answer)) {
      similarGuess = true;
    } else {
      similarGuess = false;
    }

    triedLetters.push(answer);

    let org = guessedWord;
    guessedWord = "";

    let isCorrect = false;

    for (let i = 0; i < correctWord.length; i++) {
      if (correctWord[i] == answer) {
        guessedWord += answer;
        isCorrect = true;
      } else {
        guessedWord += org[i];
      }
    }

    if (isCorrect == false || similarGuess == true) {
      wrongGuesses.push(answer);
    } else if (guessedWord == correctWord) {
      isGameOver = true;
      wasGuessCorrect = true;
    }
  }

  if (wrongGuesses.length == HANGMAN_UI.length) {
    isGameOver = true;
  }
}
console.log(ANSI.CLEAR_SCREEN);
console.log(drawWordDisplay());
console.log(drawList(wrongGuesses, ANSI.COLOR.RED));
console.log(HANGMAN_UI[wrongGuesses.length]);

const gameWinMessage = "Congratulations, winner winner chicken dinner";
const gameOverMessage = "Game over";
const yellowColor = ANSI.COLOR.YELLOW;

if (wasGuessCorrect) {
  console.log(yellowColor + gameWinMessage);
}
console.log(gameOverMessage);

console.log(
  "You had" +
    wrongGuesses.length +
    "wrong guesses on a total of" +
    totalAttempts +
    "attempts"
);

function ifPlayerGuessedLetter(answer) {
  return answer.length == 1;
}

while (playAgain) {
  let playerResponse = (
    await askQuestion("Do you want to play again?")
  ).toLowerCase();

  if (playerResponse.toLowerCase() == "no") {
    playAgain = false;
  }
  console.log("Thanks for playing my hangman game");
}

process.exit();
