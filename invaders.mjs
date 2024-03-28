// Importing the readline module for handling input/output
import readline from 'readline';

// Function to clear the terminal screen
const clearScreen = () => process.stdout.write('\x1Bc');

// Function to generate random numbers within a range
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Function to initialize the game state
const initializeGame = () => ({
  playerName: '',       // Player's name
  score: 0,             // Player's score
  lives: 3,             // Number of lives
  invaders: [],         // Array to store invaders' positions
  player: {             // Object to store player's position
    x: 25,              // Initial x-coordinate of the player
    y: 20               // Initial y-coordinate of the player
  }
});

// Function to draw the game board
const drawGame = (gameState) => {
  clearScreen();                                        // Clear the terminal screen
  console.log(`Player: ${gameState.playerName} | Score: ${gameState.score} | Lives: ${gameState.lives}`); // Display player info
  let board = '';                                       // Initialize the game board string
  for (let i = 0; i < 25; i++) {                        // Iterate over rows
    for (let j = 0; j < 50; j++) {                      // Iterate over columns
      let isInvader = false;                            // Flag to track if current position is an invader
      for (const invader of gameState.invaders) {       // Check if current position matches any invader's position
        if (i === invader.y && j === invader.x) {       // If yes, set the flag to true and break the loop
          isInvader = true;
          break;
        }
      }
      if (i === gameState.player.y && j === gameState.player.x) {
        board += 'V'; // Player character
      } else if (isInvader) {
        board += 'X'; // Invader character
      } else {
        board += '.'; // Empty space
      }
    }
    board += '\n';  // Add newline character at the end of each row
  }
  console.log(board);  // Print the game board
};

// Function to move the player
const movePlayer = (gameState, direction) => {
  switch (direction) {
    case 'left':
      if (gameState.player.x > 0) {
        gameState.player.x--;  // Move player left if within bounds
      }
      break;
    case 'right':
      if (gameState.player.x < 49) {
        gameState.player.x++;  // Move player right if within bounds
      }
      break;
  }
};

// Function to move the invaders
const moveInvaders = (gameState) => {
  for (const invader of gameState.invaders) {
    invader.y++; // Move invaders down
  }
};

// Function to add a new row of invaders
const addInvaders = (gameState) => {
  const newInvaders = [];
  for (let i = 0; i < 5; i++) {
    newInvaders.push({ x: getRandomNumber(0, 49), y: 0 }); // Add invaders at top row with random x-coordinates
  }
  gameState.invaders = newInvaders;  // Update the invaders array
};

// Function to check collision with invaders
const checkCollision = (gameState) => {
  for (const invader of gameState.invaders) {
    if (gameState.player.x === invader.x && gameState.player.y === invader.y) {
      gameState.lives--;  // Decrement lives if player collides with an invader
      if (gameState.lives === 0) {  // If lives reach zero, game over
        console.log('Game Over!');
        process.exit();  // Terminate the process
      }
    }
  }
};

// Function to run the game loop
const runGame = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let gameState = initializeGame();  // Initialize the game state

  rl.question('Enter your name: ', (name) => {  // Prompt user to enter their name
    gameState.playerName = name;  // Set the player's name in the game state
    drawGame(gameState);  // Draw the initial game board

    // Set raw mode to capture individual keypress events
    rl.output.write('\x1B[?25l'); // Hide cursor
    rl.input.setRawMode(true);

    // Event listener for keypress events
    rl.input.on('keypress', (str, key) => {
      // Check the sequence of keypress to determine the movement direction
      if (key.sequence === '\u001B[A') { // Up arrow key
        movePlayer(gameState, 'up');
      } else if (key.sequence === '\u001B[B') { // Down arrow key
        movePlayer(gameState, 'down');
      } else if (key.sequence === '\u001B[D') { // Left arrow key
        movePlayer(gameState, 'left');
      } else if (key.sequence === '\u001B[C') { // Right arrow key
        movePlayer(gameState, 'right');
      }
      drawGame(gameState);  // Draw the updated game board
    });

    // Game loop
    const gameLoop = setInterval(() => {
      moveInvaders(gameState);  // Move invaders downward
      if (gameState.invaders.length === 0 || gameState.invaders[gameState.invaders.length - 1].y > 23) {
        addInvaders(gameState);  // Add new row of invaders if needed
      }
      checkCollision(gameState);  // Check collision with invaders
      drawGame(gameState);  // Draw the updated game board
    }, 200);
  });
};

// Start the game
runGame();
