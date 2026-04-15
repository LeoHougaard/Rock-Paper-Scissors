/*

    Title: RPS
    Program Summary: Rock Paper Scissors evolved using trigonometry. Each choice
                     (rock / paper / scissors) maps to a fixed angle on the unit
                     circle. Math.sin(cpuAngle - playerAngle) determines the winner
                     of every round. A Canvas sine-wave graph visualizes both choices
                     after each play. Rounds and scores are tracked until the player
                     chooses to end the session.

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
        ctx / Canvas API (graph)
        increment (++)
        decrement (--)
        arrays
        comparison operators (!, ===, ||, &&)
        DOM & event listeners
        innerHTML
        function scope
        global scope
        .appendChild()
        ternary

    Authors: Amelie (Ruohan) Shen, Leo Hougaard, Isaac Leon Cauldern
    Version: 4.0
    Date (Last Edited): 02/20/2026

*/


// ============================================================
// GLOBAL VARIABLE DECLARATIONS
// ============================================================


// --- ASCII Art Title ---
const asciiTitleArt = String.raw`
     _______
---'   _____)           _______  _______    _______  ____ ___
        (_____)       //       \/       \\//       \/    /   \
        (_____)      //    /   /    /   ///        /         /
         (____)     /        _/    /    /       --//       _/
---._____(___)      \____/___/\________/\________/\\___/___/

     __________
---'    ______/_____        PPPPPPP    AAA   PPPPPPP  EEEEEEE RRRRRRR
           __________)      PP   PP  AA  AA  PP   PP  EE      RR   RR
          ____________)     PPPPPPP  AAAAAA  PPPPPPP  EEEEE   RRRRRRR
         ____________)      PP      AA    AA PP       EE      RR  RR
---._____________)          PP      AA    AA PP       EEEEEEE RR   RR

     __________
---'   _______/_____        SSSSS    CCC   IIIIII  SSSSS  SSSSS
             ________)      SS      CC  CC   II    SS      SS
          ____________)      SSSS   CC       II     SSSS    SSSS
         (____)                 SS  CC  CC   II        SS      SS
---._____(___)             SSSSS    CCC   IIIIII  SSSSS  SSSSS
`;


// --- Game State ---
let currentGameState = 'IDLE'; // tracks the active phase of the game


// --- Intro Variables ---
let currentIntroStepIndex = 0; // which step of the intro is currently active


// --- Username Variables ---
let rawUserName         = ''; // raw string from prompt
let capitalizedUserName = ''; // formatted version shown in the UI


// --- Player Choice Variables ---
let playerChoiceRaw       = ''; // raw value from the text input
let playerChoiceLowerCase = ''; // lowercased and trimmed version
let playerChoiceFirstChar = ''; // first character ('r', 'p', or 's')
let playerChoiceWord      = ''; // full word: 'rock', 'paper', or 'scissors'
let playerChoiceAngle     = 0;  // corresponding unit-circle angle


// --- Computer Choice Variables ---
let computerChoiceArray = ['rock', 'paper', 'scissors']; // array of valid CPU choices
let computerChoiceWord  = '';  // the CPU's randomly selected word
let computerChoiceAngle = 0;   // the CPU's corresponding angle
let computerRandomIndex = 0;   // the random index used for selection


// --- Game Result Variables ---
let sinDifferenceResult = 0;    // Math.sin(cpuAngle - playerAngle)
let lastRoundWinner     = null; // 'player', 'computer', or 'tie'
let currentRoundGameLog = '';   // one-line summary of the round


// --- Score Object ---
let gameScoreObject = {
    playerWin:   0,
    computerWin: 0,
    gameDraw:    0
}; // END of gameScoreObject


// --- Round Variable ---
let currentRoundNumber = 0; // increments each time the player continues





// --- RPS Angle Map ---
const rpsAngleMap = {
    rock:     -3 * Math.PI / 2, // sin(-3π/2) = 1  → top of the wave
    paper:    0,                 // sin(0) = 0       → midpoint
    scissors:  3 * Math.PI / 2  // sin(3π/2) = -1   → bottom of the wave
}; // END of rpsAngleMap


// --- RPS Emoji Map ---
const rpsEmojiMap = {
    rock:     '🪨',
    paper:    '📄',
    scissors: '✂️'
}; // END of rpsEmojiMap


// --- DOM Element References ---
const roundCounterElement      = document.getElementById('roundCounter');
const scoreDisplayElement      = document.getElementById('scoreDisplay');
const usernameDisplayElement   = document.getElementById('username');
const canvasElement            = document.getElementById('graph');
const canvasContext            = canvasElement.getContext('2d');
const canvasWidth              = canvasElement.width;
const canvasHeight             = canvasElement.height;
const graphAmplitudeValue      = 100;


// --- Intro Steps Array (function references — hoisted, safe to reference here) ---
const introStepsArray = [
    displayWelcomeStep,
    displayIntroStep,
    displayExplanationStep,
    displayPlayButtonStep
]; // END of introStepsArray


// ============================================================
// PROGRAM MANAGER — Central State Controller
// ============================================================


/*
Summary: The central game state manager. All game flow routes through here.
         No function calls another function directly for control flow —
         they call gameManager() and return. This keeps one clear entry point.
@param  newGameState {string} — the state to transition into
@return None (Void)
*/
function gameManager(newGameState) {

    currentGameState = newGameState;

    if (newGameState === 'INTRO') {
        currentIntroStepIndex = 0;
        runCurrentIntroStep();

    } else if (newGameState === 'ADVANCE_INTRO') {
        if (currentIntroStepIndex < introStepsArray.length - 1) {
            currentIntroStepIndex++; // increment to move forward in intro
        } else {
            console.warn('ADVANCE_INTRO ignored: already at last intro step.');
        }
        runCurrentIntroStep();

    } else if (newGameState === 'BACK_INTRO') {
        if (currentIntroStepIndex > 0) {
            currentIntroStepIndex--; // decrement to go back one step
        } else {
            console.warn('BACK_INTRO ignored: already at first intro step.');
        }
        runCurrentIntroStep();

    } else if (newGameState === 'START_ROUND') {
        startRoundSession();

    } else if (newGameState === 'GET_CHOICE') {
        displayChoiceInput();

    } else if (newGameState === 'CONFIRM_CHOICE') {
        displayChoiceConfirmation();

    } else if (newGameState === 'COMPUTE_RESULT') {
        computeAndDisplayResult();

    } else if (newGameState === 'ASK_CONTINUE') {
        askToContinueRound();

    } else if (newGameState === 'END_ROUND') {
        endRound();

    } else {
        console.log('gameManager: unknown state received — ' + newGameState);
    } // END of state router

} // END of gameManager


// ============================================================
// INITIALIZATION
// ============================================================


/*
Summary: Entry point for the program. Collects the username,
         logs the console intro, and launches the intro sequence.
@param  none
@return None (Void)
*/
function initializeGame() {
    collectUserName();
    logConsoleIntro();
    gameManager('INTRO');
} // END of initializeGame


/*
Summary: Console-based game flow doesn't require event listeners.
         Game runs via prompt(), confirm(), and alert() dialogs.
@param  none
@return None (Void)
*/
function initializeEventListeners() {
    // All game interaction now handled through prompts and alerts
    // Button listeners not needed for console-based gameplay
} // END of initializeEventListeners


// ============================================================
// INTRO SEQUENCE
// ============================================================


/*
Summary: Calls the intro function at the current step index.
@param  none
@return None (Void)
*/
function runCurrentIntroStep() {
    if ((currentIntroStepIndex < 0) || (currentIntroStepIndex >= introStepsArray.length)) {
        console.warn(
            `Invalid intro step index ${currentIntroStepIndex}; clamping to valid range.`
        );
        currentIntroStepIndex = Math.max(0, Math.min(currentIntroStepIndex, introStepsArray.length - 1));
    }

    const currentStepFn = introStepsArray[currentIntroStepIndex];

    if (typeof currentStepFn !== 'function') {
        console.error(
            `Intro step at index ${currentIntroStepIndex} is not callable.`,
            currentStepFn
        );
        return;
    }

    currentStepFn();
} // END of runCurrentIntroStep



/*
Summary: Intro Step 1 — Displays the personalised welcome message.
@param  none
@return None (Void)
*/
function displayWelcomeStep() {
    alert(`Welcome to Hasintbro Rock Paper Scissors, ${capitalizedUserName}!\n\nThis is not your ordinary RPS — every match becomes mathematics.`);
    console.log(`Hi ${capitalizedUserName}! — Welcome step shown.`);
    gameManager('ADVANCE_INTRO');
} // END of displayWelcomeStep


/*
Summary: Intro Step 2 — Displays background information about the game concept.
@param  none
@return None (Void)
*/
function displayIntroStep() {
    alert(
        `Rock Paper Scissors is an ancient game — but at Hasintbro, we believe it needs to evolve.\n\n` +
        `We mapped each choice to an angle on the unit circle. ` +
        `Math.sin(cpuAngle − yourAngle) decides every winner.\n\n` +
        `Welcome to sin(rock, paper, scissors).`
    );
    console.log('%cWelcome to sin(rock, paper, scissors)', 'color: turquoise; font-size: 22px');
    console.log('Every game becomes math. The graph below updates after each round.');
    gameManager('ADVANCE_INTRO');
} // END of displayIntroStep


/*
Summary: Intro Step 3 — Explains how to play the game step by step.
@param  none
@return None (Void)
*/
function displayExplanationStep() {
    alert(
        `How to play:\n\n` +
        `  1. Type R, P, or S when prompted.\n` +
        `  2. Confirm your choice with OK or Cancel.\n` +
        `  3. See who won — then choose to continue or end the round.\n\n` +
        `The sine wave graph updates after every play.\n` +
        `Green line = you win  |  Red = CPU wins  |  Grey = draw`
    );
    console.log('%cHow to Play', 'color: turquoise; font-size: 18px');
    console.log('1. Type R, P, or S   2. Confirm your pick   3. See the result on the graph');
    gameManager('ADVANCE_INTRO');
} // END of displayExplanationStep


/*
Summary: Intro Step 4 — Starts the game automatically.
@param  none
@return None (Void)
*/
function displayPlayButtonStep() {
    alert('Ready to play? Let\'s start!');
    gameManager('START_ROUND');
} // END of displayPlayButtonStep


// ============================================================
// USERNAME COLLECTION
// ============================================================


/*
Summary: Prompts the user for a name, validates it (no blank input),
         confirms it, capitalizes it, and updates the DOM display.
@param  none
@return None (Void)
*/
function collectUserName() {

    rawUserName = prompt("What is your name?");

    // Keep re-prompting if the user entered blank or only spaces
    while ((rawUserName !== null) && (rawUserName.trim() === '')) {
        rawUserName = prompt("Please enter a name (cannot be blank):");
    } // END of while blank name entered

    capitalizedUserName = capitalizeFirstLetter(rawUserName);

    if ((rawUserName === null) || (!confirm(`Your name is "${capitalizedUserName}" — confirm?`))) {
        capitalizedUserName = 'Mr. Vatougios';
        alert('Username set to default: Mr. Vatougios');
        console.log('Username set to default.');
    } // END of if name cancelled or rejected

    usernameDisplayElement.innerHTML = capitalizedUserName;

} // END of collectUserName


/*
Summary: Returns a copy of the input string with its first letter capitalized.
         Uses a ternary to guard against empty or null input.
@param  inputString {string} — the string to capitalize
@return {string} — capitalized string, or empty string if falsy
*/
function capitalizeFirstLetter(inputString) {
    const capitalizedResult = (!inputString) ? '' : inputString.charAt(0).toUpperCase() + inputString.slice(1);
    return capitalizedResult;
} // END of capitalizeFirstLetter


// ============================================================
// ROUND MANAGEMENT
// ============================================================


/*
Summary: Initializes round variables and sends control to GET_CHOICE.
@param  none
@return None (Void)
*/
function startRoundSession() {
    currentRoundNumber = 1;
    refreshRoundDisplay();
    refreshScoreDisplay();
    gameManager('GET_CHOICE');
} // END of startRoundSession


/*
Summary: Prompts the user for their choice (R, P, or S).
@param  none
@return None (Void)
*/
function displayChoiceInput() {
    playerChoiceRaw = prompt('Enter your choice (R for Rock, P for Paper, S for Scissors):');
    processPlayerChoice();
} // END of displayChoiceInput


/*
Summary: Reads the global playerChoiceRaw, validates it, maps it to a word
         and angle, then routes to CONFIRM_CHOICE or back to GET_CHOICE.
@param  none  (reads global playerChoiceRaw)
@return None (Void)
*/
function processPlayerChoice() {

    if (playerChoiceRaw === null) {
        alert("Input was cancelled — please try again.");
        console.log("Input cancelled — returning to GET_CHOICE.");
        gameManager('GET_CHOICE');
        return;
    } // END of if null input

    playerChoiceLowerCase = playerChoiceRaw.toLowerCase().trim();
    playerChoiceFirstChar = playerChoiceLowerCase.charAt(0);

    if (playerChoiceFirstChar === 'r') {
        playerChoiceWord  = 'rock';
        playerChoiceAngle = rpsAngleMap.rock;

    } else if (playerChoiceFirstChar === 'p') {
        playerChoiceWord  = 'paper';
        playerChoiceAngle = rpsAngleMap.paper;

    } else if (playerChoiceFirstChar === 's') {
        playerChoiceWord  = 'scissors';
        playerChoiceAngle = rpsAngleMap.scissors;

    } else {
        alert("That's not a valid move. Please enter R, P, or S.");
        console.log("Invalid input: '" + playerChoiceRaw + "' — re-routing to GET_CHOICE.");
        gameManager('GET_CHOICE');
        return;
    } // END of choice mapping

    gameManager('CONFIRM_CHOICE');

} // END of processPlayerChoice


/*
Summary: Confirms the player's chosen move via confirm dialog.
@param  none
@return None (Void)
*/
function displayChoiceConfirmation() {
    const userConfirmed = confirm(`You chose ${playerChoiceWord}. Confirm?`);

    if (userConfirmed) {
        gameManager('COMPUTE_RESULT');
    } else {
        gameManager('GET_CHOICE');
    } // END of confirmation check

} // END of displayChoiceConfirmation


/*
Summary: Generates the CPU choice, evaluates the winner, updates the score,
         redraws the graph, logs the result, then routes to ASK_CONTINUE.
@param  none
@return None (Void)
*/
function computeAndDisplayResult() {
    generateComputerChoice();
    evaluateWinner();
    refreshScoreDisplay();
    logRoundToConsole();
    drawSineGraph();
    gameManager('ASK_CONTINUE');
} // END of computeAndDisplayResult


/*
Summary: Randomly picks the computer's choice from computerChoiceArray.
@param  none
@return None (Void)
*/
function generateComputerChoice() {
    computerRandomIndex = Math.floor(Math.random() * 3);
    computerChoiceWord  = computerChoiceArray[computerRandomIndex];
    computerChoiceAngle = rpsAngleMap[computerChoiceWord];
} // END of generateComputerChoice


/*
Summary: Uses Math.sin on the angle difference to determine the winner.
         Updates gameScoreObject and displays a result message.
@param  none
@return None (Void)
*/
function evaluateWinner() {

    currentRoundGameLog = `You: ${playerChoiceWord}  |  CPU: ${computerChoiceWord}`;
    sinDifferenceResult = Math.sin(computerChoiceAngle - playerChoiceAngle);

    if (sinDifferenceResult > 0) {
        lastRoundWinner = 'player';
        gameScoreObject.playerWin++;
        displayMessage(`${currentRoundGameLog}\n\nCongrats — you win! 🎉`);
        console.log('Result: Player wins!');

    } else if (sinDifferenceResult < 0) {
        lastRoundWinner = 'computer';
        gameScoreObject.computerWin++;
        displayMessage(`${currentRoundGameLog}\n\nThe CPU wins this one. 🤖`);
        console.log('Result: CPU wins.');

    } else {
        lastRoundWinner = 'tie';
        gameScoreObject.gameDraw++;
        displayMessage(`${currentRoundGameLog}\n\nIt's a draw — go do some drawing! ✏️`);
        console.log('Result: Draw.');
    } // END of winner evaluation

} // END of evaluateWinner


/*
Summary: Asks the player if they want to continue the round.
         YES increments the round and routes to GET_CHOICE.
         NO routes to END_ROUND.
@param  none
@return None (Void)
*/
function askToContinueRound() {
    const userContinues = confirm('Do you want to continue playing?');

    if (userContinues) {
        currentRoundNumber++;
        refreshRoundDisplay();
        gameManager('GET_CHOICE');
    } else {
        gameManager('END_ROUND');
    } // END of continue check

} // END of askToContinueRound


/*
Summary: Ends the current round. Shows final score, resets variables,
         and asks if the player wants to play again.
@param  none
@return None (Void)
*/
function endRound() {

    logThankYou();

    const finalScore = `Final Score — You: ${gameScoreObject.playerWin} | CPU: ${gameScoreObject.computerWin} | Draws: ${gameScoreObject.gameDraw}`;
    alert(`Thanks for playing Hasintbro RPS, ${capitalizedUserName}!\n\n${finalScore}`);

    // Reset score object
    gameScoreObject = { playerWin: 0, computerWin: 0, gameDraw: 0 };
    refreshScoreDisplay();

    // Reset choice variables
    lastRoundWinner       = null;
    playerChoiceRaw       = '';
    playerChoiceLowerCase = '';
    playerChoiceFirstChar = '';
    playerChoiceWord      = '';
    computerChoiceWord    = '';

    // Reset round counter
    currentRoundNumber = 0;
    refreshRoundDisplay();

    // Ask if player wants to play again
    const playAgain = confirm('Would you like to play again?');
    if (playAgain) {
        gameManager('START_ROUND');
    } else {
        alert('Thanks for playing! Goodbye!');
    } // END of play again check

} // END of endRound


// ============================================================
// UI HELPERS
// ============================================================


/*
Summary: Displays a message via alert dialog.
@param  messageText      {string}  — the text to display
@param  keepInputVisible {boolean} — unused (kept for compatibility)
@return None (Void)
*/
function displayMessage(messageText, keepInputVisible) {
    alert(messageText);
} // END of displayMessage


/*
Summary: Updates the round counter element in the UI and logs to console.
@param  none
@return None (Void)
*/
function refreshRoundDisplay() {

    if (currentRoundNumber > 0) {
        roundCounterElement.innerText = `${currentRoundNumber}`;
        console.log(`Round: ${currentRoundNumber}`);
    } else {
        roundCounterElement.innerText = '—';
        console.log('Round counter reset.');
    } // END of if round counter update

} // END of refreshRoundDisplay


/*
Summary: Updates the score display element in the UI.
@param  none
@return None (Void)
*/
function refreshScoreDisplay() {
    scoreDisplayElement.innerText =
        `Score -> You: ${gameScoreObject.playerWin}  |  CPU: ${gameScoreObject.computerWin}  |  Draws: ${gameScoreObject.gameDraw}`;
} // END of refreshScoreDisplay


// ============================================================
// CONSOLE LOGGING
// ============================================================


/*
Summary: Logs the styled title and game explanation to the browser console.
         Called once at startup.
@param  none
@return None (Void)
*/
function logConsoleIntro() {
    console.log(asciiTitleArt);
    console.log('%cHasintbro RPS', 'color: turquoise; font-size: 28px; font-weight: bold');
    console.log('%cRock · Paper · Scissors · Evolved', 'color: #c084fc; font-size: 16px');
    console.log('─────────────────────────────────────────');
    console.log('How the math works:');
    console.log('  rock     → angle: -3π/2  (sin = 1,  top of wave)');
    console.log('  paper    → angle: 0      (sin = 0,  midpoint)');
    console.log('  scissors → angle: 3π/2   (sin = -1, bottom of wave)');
    console.log('  Winner   = Math.sin(cpuAngle − yourAngle)');
    console.log('    > 0 → CPU wins  |  < 0 → you win  |  = 0 → draw');
    console.log('─────────────────────────────────────────');
    console.log(`Welcome, ${capitalizedUserName}! The game is starting...`);
} // END of logConsoleIntro


/*
Summary: Logs the round number, both choices, the sin value, and the running score.
@param  none
@return None (Void)
*/
function logRoundToConsole() {
    console.log(`\nRound ${currentRoundNumber}: ${currentRoundGameLog}`);
    console.log(`sin(${computerChoiceAngle.toFixed(2)} − ${playerChoiceAngle.toFixed(2)}) = ${sinDifferenceResult.toFixed(4)}`);
    console.log(`Score → You: ${gameScoreObject.playerWin} | CPU: ${gameScoreObject.computerWin} | Draws: ${gameScoreObject.gameDraw}`);
} // END of logRoundToConsole


/*
Summary: Logs the closing thank-you and final score summary to the console.
@param  none
@return None (Void)
*/
function logThankYou() {
    console.log('─────────────────────────────────────────');
    console.log(`Thanks for playing Hasintbro RPS, ${capitalizedUserName}!`);
    console.log(`Final: You ${gameScoreObject.playerWin} | CPU ${gameScoreObject.computerWin} | Draws ${gameScoreObject.gameDraw}`);
    console.log('─────────────────────────────────────────');
} // END of logThankYou


// ============================================================
// CANVAS GRAPH
// ============================================================


/*
Summary: Draws a single emoji character at the given canvas position.
@param  xCoordinate {number} — horizontal pixel position
@param  yCoordinate {number} — vertical pixel position
@param  emojiChar   {string} — the emoji to render
@param  fontSize    {number} — font size in pixels
@return None (Void)
*/
function drawEmojiOnCanvas(xCoordinate, yCoordinate, emojiChar, fontSize) {
    canvasContext.font         = `${fontSize}px serif`;
    canvasContext.textAlign    = 'center';
    canvasContext.textBaseline = 'middle';
    canvasContext.fillText(emojiChar, xCoordinate, yCoordinate);
} // END of drawEmojiOnCanvas


/*
Summary: Clears and redraws the sine wave graph with axes, the wave curve,
         RPS emoji markers, and a coloured line between the two choices.
@param  none
@return None (Void)
*/
function drawSineGraph() {

    canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw axes
    canvasContext.beginPath();
    canvasContext.moveTo(0, canvasHeight / 2);
    canvasContext.lineTo(canvasWidth, canvasHeight / 2); // horizontal x-axis
    canvasContext.moveTo(canvasWidth / 2, 0);
    canvasContext.lineTo(canvasWidth / 2, canvasHeight); // vertical y-axis
    canvasContext.strokeStyle = '#7d6b8d';
    canvasContext.lineWidth   = 1;
    canvasContext.stroke();

    // Draw sine wave curve
    canvasContext.beginPath();
    canvasContext.strokeStyle = '#402954';
    canvasContext.lineWidth   = 2;

    for (let waveAngle = -Math.PI * 2; waveAngle <= Math.PI * 2; waveAngle += 0.01) {

        const wavePixelX = (waveAngle + Math.PI * 2) * (canvasWidth / (Math.PI * 4));
        const wavePixelY = canvasHeight / 2 - Math.sin(waveAngle) * graphAmplitudeValue;

        if (waveAngle === -Math.PI * 2) {
            canvasContext.moveTo(wavePixelX, wavePixelY);
        } else {
            canvasContext.lineTo(wavePixelX, wavePixelY);
        } // END of if first point on wave

    } // END of sine wave loop

    canvasContext.stroke();

    // Draw the RPS emoji icons at their respective wave positions
    for (const choiceKey in rpsAngleMap) {

        const iconPixelX = (rpsAngleMap[choiceKey] + Math.PI * 2) * (canvasWidth / (Math.PI * 4));
        const iconPixelY = canvasHeight / 2 - Math.sin(rpsAngleMap[choiceKey]) * graphAmplitudeValue;
        drawEmojiOnCanvas(iconPixelX, iconPixelY, rpsEmojiMap[choiceKey], 20);

    } // END of for each RPS choice

    // Draw line and player/CPU markers only after a round has been played
    if (lastRoundWinner !== null) {

        const playerPixelX = (playerChoiceAngle + Math.PI * 2) * (canvasWidth / (Math.PI * 4));
        const playerPixelY = canvasHeight / 2 - Math.sin(playerChoiceAngle) * graphAmplitudeValue;
        const cpuPixelX    = (computerChoiceAngle + Math.PI * 2) * (canvasWidth / (Math.PI * 4));
        const cpuPixelY    = canvasHeight / 2 - Math.sin(computerChoiceAngle) * graphAmplitudeValue;

        // Set line colour based on winner
        canvasContext.beginPath();
        canvasContext.lineWidth = 3;

        if (lastRoundWinner === 'player') {
            canvasContext.strokeStyle = 'green';
        } else if (lastRoundWinner === 'computer') {
            canvasContext.strokeStyle = 'red';
        } else {
            canvasContext.strokeStyle = 'gray';
        } // END of winner colour selection

        canvasContext.moveTo(playerPixelX, playerPixelY);
        canvasContext.lineTo(cpuPixelX, cpuPixelY);
        canvasContext.stroke();

        // Draw player and CPU emoji markers over the line
        drawEmojiOnCanvas(playerPixelX, playerPixelY, '🧑', 28);
        drawEmojiOnCanvas(cpuPixelX, cpuPixelY, '🤖', 28);

    } // END of if a round has been played

} // END of drawSineGraph


// ============================================================
// START OF MAIN
// ============================================================


/*
Summary: Main program entry point. Called when DOM is ready.
@param  none
@return None (Void)
*/
function runProgram() {
    initializeEventListeners();
    initializeGame();
} // END of runProgram


document.addEventListener('DOMContentLoaded', () => 
    {
        setTimeout(() => {
            runProgram();
        }, 100); // slight delay to ensure DOM is fully ready
    });
// RPS is a Rock Paper Scissors game that uses Math.sin on unit-circle angles to
// determine each round's winner, with a live Canvas sine-wave graph and round tracking.


// ============================================================
// END OF PROGRAM
// ============================================================


/* End of Program Notes

Future feature ideas:
    - Easy mode:   nearly 100% player win rate
    - Medium mode: true random (33 / 33 / 33)
    - Hard mode:   nearly 0% player win rate
    - CPU vs CPU:  auto-plays two AIs against each other
    - Wagering:    bet on the outcome before each round

*/
