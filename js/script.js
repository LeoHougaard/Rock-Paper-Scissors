
/* 

	Title: RPS
	Program Summary: This is rock paper scissors but more complicated...
	
	Important (KEY) Program Elements Used: 

  prompt(), alert(), and confirm()
  functions
  function callback
  .slice()
  .trim()
  .toLowerCase()
  while loop
  Math.sin()
  Math.random()
  Math.floor()
  ctx/graph (Canvas API)
  increment (++)
  decrement (--)
  arrays
  comparison Operators (!, ===, ||, &&)
  DOM & event listeners
  inner html
  function scope
  global scope
  .appendChild()
  ternary

	Authors (Teammates/Owners/Project Roles): Amelie (Ruohan) Shen, Leo Hougaard, and Isaac Leon Cauldern
	
	Version (Project Iteration): 4.0
	
	Date (Last Edited): 02/20/2026

*/




// Start of Functions           





/*
Summary: The play rock paper scissors function 
@parms: none
@return: None (Void) - This is the main entry point that resets the current intro step and plays the next button function
*/
function playRPS() {
  welcomeRPS();
  introRPS();
  explanationRPS();
  if (confirm("Do you want to play the console version?")) {
    roundNumber = 1;
    updateRoundDisplay();
    askForChoiceConsole();
  } else {
    startRoundSession();
  }
} //End of the play rock paper scissors function





/*
Summary: The rock paper scissors function
@parms: none
@return: None (Void) - only runs ask for choice
*/
function RPSGame() {
  askForChoice();
} // End of rock paper scissors game function





/*
Summary: The title function
@parms: ASCIITitle
@return: None - Outputs the ASCII title to the console.
*/
function titleRPS() {
  console.log(ASCIITitle);
}// End of the title function





/*
Summary: The welcome rock paper scissors function
@parms: userNameCapitalized
@return: None - Triggers alerts and logs to greet the user.
*/
function welcomeRPS() {
  userNameCollector();
  alert(`Hi ${userNameCapitalized}! Welcome to the Hasintbro Rock Paper Scissors.`);
  console.log(`Hi ${userNameCapitalized}!`);
  titleRPS();
} //End of welcome rock paper scissors function





/*
Summary: Intro rock paper scissors function
@parms: none
@return: None - Logs stylized introduction text to the console.
*/
function introRPS() {
  alert(`Rock Paper Scissors is an ancient game. However, it is still valuable in our modern society. However, in our modern era it needs to evolve to keep up with the times. Therefore, Hasintbro is determined to bring this important game with us into the future.`);
  console.log('%cWelcome to sin(rock, paper, scissors).', 'color: turquoise; font-size: 30px');
  console.log('This is where all your games of rock paper scissors will become math!');
  console.log('%cIntroduction', 'color: turquoise; font-size: 25px');
  console.log(`Rock Paper Scissors is an ancient game. However, it is still valuable in our modern society. However, in our modern era it needs to evolve to keep up with the times. Therefore, Hasintbro is determined to bring this important game with us into the future.`);
  console.log('%cExplanation', 'color: turquoise; font-size: 25px');
} //End of intro rock paper scissors function





/*
Summary: Explanation rock paper scissors function
@parms: none
@return: None - Displays game instructions via alerts and logs.
*/
function explanationRPS() {
  alert(
    `The math will resolve all your competitions.\n\nHow to play RPS:\n1. Enter r, p, or s (rock paper or scissors) when prompted to choose your play\n2. The computer will play and you will find out if you win, lose, or draw\n3. Continue the round or end it to see your final score`
  );
  console.log(
    `The math will resolve all your competitions.\n\nHow to play RPS:\n1. Enter r, p, or s (rock paper or scissors) when prompted to choose your play\n2. The computer will play and you will find out if you win, lose, or draw\n3. Continue the round or end it to see your final score`
  );
  console.log(
    '%cCome back any time you need a good game of rock paper scissors!',
    "color: #3399FF"
  );
} //End of explanation rock pa//r scissors function





/*
Summary: Asks the user to enter a move (prompt version).
@parms: None
@return: None
*/
function askForChoiceConsole() {
  do {
      userPlay = prompt("Type R, P, or S");
      
      // esc/cancel handling
      if (userPlay === null) {
        if (confirm("Do you want to exit the round?")) {
          console.log("User has stopped playing.");
          return;
        } else {
          continue;
        }
      }

      playerChoiceLowercase = userPlay.trim().toLowerCase();

    } while((userPlay === null) || (userPlay.trim() === ""));

  return userChoiceHandlerConsole(userPlay);
} //End of ask for choice function





/*
Summary: Asks the user to enter a move (html).
@parms: None
@return: None
*/
function askForChoice() {
  showMessage("Type R, P, or S", true); // Show the message and keep input visible

  inputArea.classList.remove("hidden"); // Show the input field
  userInput.value = ''; // Clear previous input

  // Attach submit button listener
  document.getElementById("submitChoice").onclick = function () {
    const playerInput = userInput.value;
    inputArea.classList.add("hidden"); // hide after submission
    userChoiceHandler(playerInput);          // process choice
  };
} //End of ask for choice function






/*
Summary: Validates a prompt-based RPS choice and asks the user to confirm it.
@parms: userPlay
@return: String - Returns "quit" for cancelled input or "retry" for invalid input.
*/
function userChoiceHandlerConsole(userPlay) {

  playerChoiceConverted = playerChoiceLowercase.charAt(0);

  switch (playerChoiceConverted) {
    case 'r':
      playerChoiceConfirmation = 'rock';
      playerChoiceTrig = rpsAngles.rock;
      break;

    case 'p':
      playerChoiceConfirmation = 'paper';
      playerChoiceTrig = rpsAngles.paper;
      break;

    case 's':
      playerChoiceConfirmation = 'scissors';
      playerChoiceTrig = rpsAngles.scissors;
      break;

    default:
      console.log("That's not a legal play.");
      console.log("Pick rock paper or scissors.");
      alert("That's not a legal play.");
      alert("Pick rock paper or scissors.");
      askForChoiceConsole();
      return;
  } // end of input validation

  confirmMessage = `Did you want to play ${playerChoiceConfirmation}?`;

  if (confirm(confirmMessage)) {

    console.log(`You chose ${playerChoiceConfirmation}`);
    computerChoiceCollector();
    whatHappened();
    lastWinner = normalDetermineWinner();
    gameScoreLog();

    continueRound = confirm("Do you want to continue the round?");

    if (continueRound) {

      roundNumber++;
      updateRoundDisplay(); 

      return askForChoiceConsole();

    } else {
      thankYou();
    }
  } else {
    return askForChoiceConsole();
  }
} //End of play handler function




/*
Summary: Validates user input, maps choices to game data, and manages the confirmation/gameplay loop.
@parms: playerChoice
@return: Returns "quit" for null input or "retry" for invalid input
*/ 
function userChoiceHandler(playerChoice) {
  // input validation
  if  (playerChoice === null) {
    alert("User cancelled the prompt.");
    alert('Click "play" to try again.');
    console.log("User cancelled the prompt.");
    console.log('Click "play" to try again.');
    return "quit";
  }
  
  playerChoiceLowercase = playerChoice.trim().toLowerCase();
  playerChoiceConverted = playerChoiceLowercase.charAt(0);

  switch (playerChoiceConverted) {
    case 'r':
      playerChoiceConfirmation = 'rock';
      playerChoiceTrig = rpsAngles.rock;
      break;

    case 'p':
      playerChoiceConfirmation = 'paper';
      playerChoiceTrig = rpsAngles.paper;
      break;

    case 's':
      playerChoiceConfirmation = 'scissors';
      playerChoiceTrig = rpsAngles.scissors;
      break;

    default:
      console.log("That's not a legal play.");
      console.log("Pick rock paper or scissors.");
      alert("That's not a legal play.");
      alert("Pick rock paper or scissors.");
      askForChoice()
      return "retry";
  } // end of input validation
    
  showMessage(`Confirm your play:`);

  // Ask user to confirm choice
  askYesNo(
    playerChoiceConfirmation,
    () => {
      // YES → proceed
      computerChoiceCollector();
      whatHappened();
      lastWinner = normalDetermineWinner();
      updateScoreDisplay();
      gameScoreLog();
      drawGraph();

      // Ask if they want to play again
      askYesNo(
        "Do you want to continue the round?",
        () => { 
          roundNumber++;
          updateRoundDisplay();
          RPSGame(); 
        },
        () => { endRound(); },
        true
      );
    },
    () => {
      // NO → pick again
      askForChoice();
    }
  );
} // end of function choice handler function




/*
Summary: Displays a yes or no confirmation message.
@parms: confirmMessage, callbackYes, callbackNo, isFullMessage
@return: None
*/
function askYesNo(confirmMessage, callbackYes, callbackNo, isFullMessage = false) {
  // Function variables
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");



  confirmText.innerText = isFullMessage ? confirmMessage : `Do you want to play "${confirmMessage}"?`;   // If isFullMessage is true, use the message as-is. Otherwise, prepend "Do you want to play"

  confirmArea.classList.remove("hidden");

  yesBtn.onclick = null;
  noBtn.onclick = null;

  yesBtn.onclick = () => {
      confirmArea.classList.add("hidden");
      callbackYes();
  };

  noBtn.onclick = () => {
      confirmArea.classList.add("hidden");
      callbackNo();
  };
} // end of function



/*
Summary: Computer choice collector 
@parms: None
@return: None - Randomly chooses rock, paper, or scissors for the computer.
*/
function computerChoiceCollector() {
  randomNumber = Math.floor(Math.random()*3);

  computerChoice = ['rock', 'paper', 'scissors'];
  //computerChoiceTrig = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];
  computerChoiceTrig = computerChoice[randomNumber];
  computerChoiceTrig = rpsAngles[computerChoiceTrig];
} // End of computer choice collector





/*
Summary: Determine Winner function 
@parms: trigResult, 
@return: String - Returns the winner of the round: "player", "computer", or "tie".
*/
function normalDetermineWinner() {
  trigResult = Math.sin(computerChoiceTrig - playerChoiceTrig); // Using sine to determine the relative position on the unit circle
  if (trigResult > 0) {
    youWin();
    gameScore.playerWin++;
    return "player";
  } else if (trigResult < 0) {
    youLose();
    gameScore.computerWin++;
    return "computer";
  } else {
    youDraw();
    gameScore.gameDraw++;
    return "tie";
  }
} // End of determine winner function





/*
Summary: What happened function 
@parms: gameLog
@return: None - Displays the summary of the current moves via alert.
*/
function whatHappened() {
  gameLog = `player: ${playerChoiceConfirmation}\ncpu: ${computerChoice[randomNumber]}`;
  console.log(gameLog);
}//End of what happened function





/*
Summary: Game score log function 
@parms: None
@return: None - Logs the current scoreboard to the console.
*/
function gameScoreLog() {
  console.log(`-----\nFinal Score:\nYou: ${gameScore.playerWin}\nComputer: ${gameScore.computerWin}\nDraw: ${gameScore.gameDraw}\n-----`);
}//End of game score log function





/*
Summary: You win function 
@parms: None
@return: None - Displays the result message to the user.
*/
function youWin() {
  alert(`${gameLog}\n\nCongrats you win!`);
  showMessage(`${gameLog}\n\nCongrats you win!`);
  console.log('we have a winner!');
} //End of you win function





/*
Summary: You draw function 
@parms: None
@return: None - Displays the result message to the user.
*/
function youDraw() {
  alert(`${gameLog}\n\nyou draw, go do some drawing`);
  showMessage(`${gameLog}\n\nyou draw, go do some drawing`);
  console.log('we have... a draw');
} //End of you draw function





/*
Summary: You lose function
@parms: None
@return: None - Displays the result message to the user.
*/
function youLose() {
  alert(`${gameLog}\n\nloser`);
  showMessage(`${gameLog}\n\nloser`);
  console.log('we have a loser...');
} // End of you lose function





/*
Summary: Ends the current round, resets the score, and shows the play again option.
@parms: None
@return: None
*/
function endRound() {
  thankYou(); // Call the thank you function

  // Reset game score
  gameScore = { playerWin: 0, computerWin: 0, gameDraw: 0 };
  updateScoreDisplay();
  lastWinner = null;
  playerChoice = '';
  playerChoiceLowercase = '';
  playerChoiceConverted = '';
  playerChoiceConfirmation = '';
  computerChoice = '';

  //reset round number
  roundNumber = 0;
  updateRoundDisplay();

  // Hide other areas
  inputArea.classList.add("hidden");
  msgBox.classList.add("hidden");
  confirmArea.classList.add("hidden");

  endMsg.classList.remove("hidden");

  document.getElementById("playAgainBtn").onclick = () => {
  endMsg.classList.add("hidden");
  startRoundSession();
};

} // end of end round function





/*
Summary: Thank you function 
@parms: None
@return: None - Logs a closing message.
*/
  function thankYou(){
    alert('Thank you for visiting and playing a round of Hasintbro RPS! Please come play again anytime :]')
    console.log('Thank you for visiting and playing a round of Hasintbro RPS! Please come play again anytime :]');
} // End of thank you function





/*
Summary: Draw emoji function 
@parms: graphX, graphY, emoji, size
@return: None - Draws a specific emoji to the HTML5 Canvas.
*/
function drawEmoji(graphX, graphY, emoji, size = 24) {
  ctx.font = `${size}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(emoji, graphX, graphY);
} // End of draw emoji function





/*
Summary: Start of draw graph function 
@parms: None
@return: None - Renders the sine wave, points, and connection lines on the Canvas.
*/
function drawGraph() {
  ctx.clearRect(0, 0, width, height);

  // Draw axes
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2); // x-axis
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height); // y-axis
  ctx.strokeStyle = "#7d6b8d";
  ctx.stroke();

  // Draw sine wave
  ctx.beginPath();
  ctx.strokeStyle = "#402954";
  for (let graphX = -Math.PI * 2; graphX <= Math.PI * 2; graphX += 0.01) {
    const canvasX = (graphX + Math.PI * 2) * (width / (Math.PI * 4));
    const canvasY = height / 2 - Math.sin(graphX) * 100;
    if (graphX === -Math.PI * 2) {
      ctx.moveTo(canvasX, canvasY);
    } else {
      ctx.lineTo(canvasX, canvasY);
    }
  }
  ctx.stroke();

  for (let choiceName in rpsAngles) {
    const graphX = (rpsAngles[choiceName] + Math.PI * 2) * (width / (Math.PI * 4));
    const graphY = height / 2 - Math.sin(rpsAngles[choiceName]) * 100;
    drawEmoji(graphX, graphY, rpsEmoji[choiceName], 20);
  }

  // line connecting player and CPU
  if (
    typeof playerChoiceTrig !== "undefined" &&
    typeof computerChoiceTrig !== "undefined" &&
    lastWinner
  ) {
    ctx.beginPath();

    if (lastWinner === "player") {
      ctx.strokeStyle = "green";
    } else if (lastWinner === "computer") {
      ctx.strokeStyle = "red";
    } else {
      ctx.strokeStyle = "gray";
    }

    ctx.lineWidth = 3;

    ctx.moveTo(
      (playerChoiceTrig + Math.PI * 2) * (width / (Math.PI * 4)),
      height / 2 - Math.sin(playerChoiceTrig) * 100
    );
    ctx.lineTo(
      (computerChoiceTrig + Math.PI * 2) * (width / (Math.PI * 4)),
      height / 2 - Math.sin(computerChoiceTrig) * 100
    );

    ctx.stroke();
  }

  // Draw CPU dot
  if (typeof computerChoiceTrig !== "undefined") {
    const computerX = (computerChoiceTrig + Math.PI * 2) * (width / (Math.PI * 4));
    const computerY = height / 2 - Math.sin(computerChoiceTrig) * graphAmplitude;
    drawEmoji(computerX, computerY, "🤖", 28);
  }

  // Draw player dot
  if (typeof playerChoiceTrig !== "undefined") {
    const playerX = (playerChoiceTrig + Math.PI * 2) * (width / (Math.PI * 4));
    const playerY = height / 2 - Math.sin(playerChoiceTrig) * graphAmplitude;
    drawEmoji(playerX, playerY, "🧑", 28);
  }
} // End of draw graph function





/*
Summary: Updates and displays a message box while managing UI visibility.
@parms: messageText, keepInputVisible
@return: None
*/
function showMessage(messageText, keepInputVisible = false) {
  confirmArea.classList.add("hidden"); // hide confirm area

  // Only hide inputArea if keepInputVisible is false
  if (!keepInputVisible) {
    inputArea.classList.add("hidden");
  }

  msgText.innerText = messageText;
  msgBox.classList.remove("hidden");
} // end of show message function





/*
Summary: Initializes a new game round and starts the gameplay logic.
@parms: None
@return: None
*/
function startRoundSession() {
  roundNumber = 1;
  updateRoundDisplay();
  RPSGame();
} // end of start round session function





/*
Summary: Updates the UI and console with the current round status.
@parms: roundNumber, roundText
@return: None
*/
function updateRoundDisplay() {
  if (roundNumber > 0) {
    roundText.innerText = `Round: ${roundNumber}`;
    console.log(`Round: ${roundNumber}`);
  } else {
    roundText.innerText = "Round: Not Started";
    console.log(`Rounds reset.`);
  }
} // end of update round display function





/*
Summary: Updates the UI text to reflect current game standings.
@parms: None
@return: None
*/
function updateScoreDisplay() {
  scoreText.innerText = 
    `Score -> You: ${gameScore.playerWin} | CPU: ${gameScore.computerWin} | Draws: ${gameScore.gameDraw}`;
} // end of update score display function





/*
Summary: Capitalize First Letter Function 
@parms: text
@return: String - Returns the input string with the first character capitalized.
*/
function capitalizeFirstLetter(text) { 
  if (!text) {
    return '';
  }

  return text.charAt(0).toUpperCase() + text.slice(1); 
} // End of Capitalize First Letter Function





/*
Summary: Prompts for, validates, and displays a capitalized user-provided name.
@parms: userName, userNameCapitalized
@return: None - Updates the global userNameCapitalized and the DOM.
*/
function userNameCollector() {
  userName = prompt("What is your name?");

  // keep reprompting if user gave empty/blank input
  while ((userName !== null) && (userName.trim() === "")) {
    userName = prompt("Please enter a name:");
  } // End of while user need to enter a name

  userNameCapitalized = capitalizeFirstLetter(userName);

  if (userName === null || !confirm(`Your name is "${userNameCapitalized}"?`)) {
    userNameCapitalized = "Mr. Vatougios";
    alert('Username set to default.');
    console.log('Username set to default.');
  } 
  
  usernameElement = document.getElementById("username");
  usernameElement.innerHTML = userNameCapitalized;
} // End of assigning user name function





// Start of program





// Global variable declarations




// username variables
var userName = '';
let usernameElement; // html element of username
let userNameCapitalized; // capitalized username
let text; // text to capitalize

// ask another question prompting
let tryAgain;

// html messages variables
const msgBox = document.getElementById("messageBox");
const msgText = document.getElementById("messageText");
const inputArea = document.getElementById("inputArea");
const confirmArea = document.getElementById("confirmArea");
const confirmText = document.getElementById("confirmText");

let classList;
let innerText;
let messageText;
let keepInputVisible;

// user input variables
const userInput = document.getElementById("userInput");

// game variables
let playerChoice;
let playerChoiceLowercase;
let playerChoiceConverted;
let playerChoiceConfirmation;

let computerChoice;
let gameLog;

// game results variables
let trigResult;
let playerChoiceTrig;
let computerChoiceTrig;

// round variables
let roundNumber = 0;
const roundText = document.getElementById("roundCounter");
const endMsg = document.getElementById("endRoundMessage"); // end of round variable

// score variables
const scoreText = document.getElementById("scoreDisplay");
let lastWinner = null;
let gameScore = { playerWin: 0, computerWin: 0, gameDraw: 0 };
let playerWin;
let computerWin;
let gameDraw;

// graph variables
const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const rpsAngles = {
  rock: -3 * Math.PI / 2,      // sin = 1 → top
  paper: 0,                    // sin = 0 → middle
  scissors: 3 * Math.PI / 2    // sin = -1 → bottom
};
const rpsEmoji = {
  rock: "🪨",
  paper: "📄",
  scissors: "✂️"
};
const graphAmplitude = 100;


// ASCII art
const ASCIITitle = String.raw`                                                                                                         
     _______
---'   _____)           _______  _______    _______  ____ ___     
        (_____)       //       \/        \/        \/    /   \
        (_____)      //    /   /    /    /         /         /
         (____)     /        _/    /    /       --/        _/ 
---._____(___)      \____/___/\________/\________/\____/___/  

     __________
---'    ______/_____        ▄▄▄▄▄▄▄     ▄▄▄▄   ▄▄▄▄▄▄▄    ▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄ 
           __________)      ███▀▀███▄ ▄██▀▀██▄ ███▀▀███▄ ███▀▀▀▀▀ ███▀▀███▄
          ____________)     ███▄▄███▀ ███  ███ ███▄▄███▀ ███▄▄    ███▄▄███▀
         ____________)      ███▀▀▀▀   ███▀▀███ ███▀▀▀▀   ███      ███▀▀██▄ 
---._____________)          ███       ███  ███ ███       ▀███████ ███  ▀███

     __________
---'   _______/_____         __    ___ __  __   __    ___   ____   __ 
             ________)      (( \  //   || (( \ (( \  // \\  || \\ (( \
          ____________)      \\  ((    ||  \\   \\  ((   )) ||_//  \\ 
         (____)             \_))  \\__ || \_)) \_))  \\_//  || \\ \_))
---._____(___)                                                                                   
`;                                                                                                 



// End of variable declarations





// Start of Main
window.addEventListener("load", playRPS);
// End  of Main







// End of program



/* End of Program Notes

Rock paper scissors ideas

Challenge level

Easy nearly 100% win rate
Medium random
33% win rate 33% lose 33% tie rate
Hard nearly 0% win rate
Auto plays 2 CPU's against each other

Roast them if they lose

Give then different rewards if they win

Gambling

Third input can bet on the outcome

Inputs

Game mode
user input

-Isaac go do the program notes -Amelie
-ok I did it using ai becuase im lazy -Isaac

-Leo write the comments -Leo
-Yes they are now completed -Leo

-Amelie go fix the html and css -Amelie
-ok -Amelie


---

Test Code

// Reset rock paper scissors function
function resetRPSGame() {
  playerChoice = '';
  playerChoiceLowercase = '';
  playerChoiceConverted = '';
  playerChoiceConfirmation = '';
  computerChoice = '';
  RPSGame();
} // End of reset rock paper scissors function
*/
