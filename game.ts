import readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";

const PLAYER_HUMAN = -1;
const PLAYER_AI = 1;
const EMPTY_POSITION = 0;
const EMPTY_SYMBOL = "#";
const HUMAN_SYMBOL = "X";
const AI_SYMBOL = "O";

const trainingData = [
  { input: [-1,0,0,0,0,0,0,0,0], target: [0,0,0,0,1,0,0,0,0] },
  { input: [0,0,-1,0,0,0,0,0,0], target: [0,0,0,0,1,0,0,0,0] },
  { input: [0,0,0,0,0,0,-1,0,0], target: [0,0,0,0,1,0,0,0,0] },
  { input: [0,0,0,0,0,0,0,0,-1], target: [0,0,0,0,1,0,0,0,0] },
  { input: [-1,-1,0,0,1,0,0,0,0], target: [0,0,1,0,0,0,0,0,0] },
  { input: [-1,0,0,-1,1,0,0,0,0], target: [0,0,0,0,0,0,1,0,0] },
  { input: [0,0,0,0,1,0,0,-1,-1], target: [0,0,0,0,0,0,1,0,0] },
  { input: [0,0,0,0,1,-1,0,0,-1], target: [0,0,1,0,0,0,0,0,0] },
  { input: [0,-1,-1,0,1,0,0,0,0], target: [1,0,0,0,0,0,0,0,0] },
  { input: [0,0,0,-1,1,-1,0,0,0], target: [0,0,0,0,0,0,0,0,1] },
  { input: [0,0,0,0,1,0,-1,-1,0], target: [0,0,0,0,0,0,0,0,1] },
  { input: [0,0,0,-1,1,0,-1,0,0], target: [1,0,0,0,0,0,0,0,0] },
  { input: [-1,0,-1,0,1,0,0,0,0], target: [0,1,0,0,0,0,0,0,0] },
  { input: [-1,0,0,0,1,0,-1,0,0], target: [0,0,0,1,0,0,0,0,0] },
  { input: [-1,0,-1,0,1,0,0,0,0], target: [0,1,0,0,0,0,0,0,0] },
  { input: [0,0,-1,0,1,0,0,0,-1], target: [0,0,0,0,0,1,0,0,0] },
  { input: [-1,0,0,0,1,0,-1,0,0], target: [0,0,0,1,0,0,0,0,0] },
  { input: [0,0,0,0,1,0,-1,0,-1], target: [0,0,0,0,0,0,0,1,0] },
  { input: [0,0,0,0,1,0,-1,0,-1], target: [0,0,0,0,0,0,0,1,0] },
  { input: [0,0,-1,0,1,0,0,0,-1], target: [0,0,0,0,0,1,0,0,0] },
  { input: [-1,0,0,0,1,0,0,0,-1], target: [0,1,0,0,0,0,0,0,0] },
  { input: [-1,0,0,0,1,0,0,0,-1], target: [0,0,0,1,0,0,0,0,0] },
  { input: [-1,0,0,0,1,0,0,0,-1], target: [0,0,0,0,0,1,0,0,0] },
  { input: [-1,0,0,0,1,0,0,0,-1], target: [0,0,0,0,0,0,0,1,0] }, 
  { input: [0,0,-1,0,1,0,-1,0,0], target: [0,1,0,0,0,0,0,0,0] },
  { input: [0,0,-1,0,1,0,-1,0,0], target: [0,0,0,1,0,0,0,0,0] },
  { input: [0,0,-1,0,1,0,-1,0,0], target: [0,0,0,0,0,1,0,0,0] },
  { input: [0,0,-1,0,1,0,-1,0,0], target: [0,0,0,0,0,0,0,1,0] },  
  { input: [-1,0,0,0,1,0,0,-1,0], target: [0,1,0,0,0,0,0,0,0] },
  { input: [-1,0,0,0,1,0,0,-1,0], target: [0,0,0,1,0,0,0,0,0] },
  { input: [-1,0,0,0,1,0,0,-1,0], target: [0,0,0,0,0,1,0,0,0] },
  { input: [0,0,-1,0,1,0,0,-1,0], target: [0,1,0,0,0,0,0,0,0] },
  { input: [0,0,-1,0,1,0,0,-1,0], target: [0,0,0,1,0,0,0,0,0] },
  { input: [0,0,-1,0,1,0,0,-1,0], target: [0,0,0,0,0,1,0,0,0] },
  { input: [0,-1,0,0,1,0,-1,0,0], target: [0,0,0,1,0,0,0,0,0] },
  { input: [0,-1,0,0,1,0,-1,0,0], target: [0,0,0,0,0,1,0,0,0] },
  { input: [0,-1,0,0,1,0,-1,0,0], target: [0,0,0,0,0,0,0,1,0] },
  { input: [0,-1,0,0,1,0,0,0,-1], target: [0,0,0,1,0,0,0,0,0] },
  { input: [0,-1,0,0,1,0,0,0,-1], target: [0,0,0,0,0,1,0,0,0] },
  { input: [0,-1,0,0,1,0,0,0,-1], target: [0,0,0,0,0,0,0,1,0] },
  { input: [-1,0,0,0,1,-1,0,0,0], target: [0,1,0,0,0,0,0,0,0] },
  { input: [-1,0,0,0,1,-1,0,0,0], target: [0,0,0,1,0,0,0,0,0] },
  { input: [-1,0,0,0,1,-1,0,0,0], target: [0,0,0,0,0,0,0,1,0] },
  { input: [0,0,0,0,1,-1,-1,0,0], target: [0,1,0,0,0,0,0,0,0] },
  { input: [0,0,0,0,1,-1,-1,0,0], target: [0,0,0,1,0,0,0,0,0] },
  { input: [0,0,0,0,1,-1,-1,0,0], target: [0,0,0,0,0,0,0,1,0] },
  { input: [0,0,-1,-1,1,0,0,0,0], target: [0,1,0,0,0,0,0,0,0] },
  { input: [0,0,-1,-1,1,0,0,0,0], target: [0,0,0,0,0,1,0,0,0] },
  { input: [0,0,-1,-1,1,0,0,0,0], target: [0,0,0,0,0,0,0,1,0] },
  { input: [0,0,0,-1,1,0,0,0,-1], target: [0,1,0,0,0,0,0,0,0] },
  { input: [0,0,0,-1,1,0,0,0,-1], target: [0,0,0,0,0,1,0,0,0] },
  { input: [0,0,0,-1,1,0,0,0,-1], target: [0,0,0,0,0,0,0,1,0] },
  { input: [0,0,0,0,-1,0,0,0,0], target: [1,0,0,0,0,0,0,0,0] },
  { input: [0,0,0,0,-1,0,0,0,0], target: [0,0,1,0,0,0,0,0,0] },
  { input: [0,0,0,0,-1,0,0,0,0], target: [0,0,0,0,0,0,1,0,0] },
  { input: [0,0,0,0,-1,0,0,0,0], target: [0,0,0,0,0,0,0,0,1] },
];

class TicTacToe {
  private board: number[][] = [];
  private currentPlayer: typeof PLAYER_AI | typeof PLAYER_HUMAN = PLAYER_HUMAN;
  private rl!: readline.Interface;

  constructor(private neuralNetwork: NeuralNetwork) {
    this.resetBoard();
  }

  /**
   * Reset game board filling every cell with EMPTY_POSITION
   * @returns void
   */
  private resetBoard(): void {
    this.board = Array(3).fill(null).map(() => Array(3).fill(0));
  }

  /**
   * Print the current board, switching player values by readable symbols.
   * @returns void
   */
  private displayBoard(): void {
    this.board.forEach((line) => {
      const lineFormatted = line.map((element) => {
        if (element === PLAYER_HUMAN) return HUMAN_SYMBOL;
        if (element === PLAYER_AI) return AI_SYMBOL;
        return EMPTY_SYMBOL;
      });
      console.log(lineFormatted.join(" "));
    })
  }

  /**
   * Verify if a given position is valid and empty for 
   * @param position - Position in the board (0-8).
   * @returns `true` if position is within the limits and empty (valid), `false` if it is not.
   */
  private isPositionValid(position: number): boolean {
    const row = Math.floor(position / 3);
    const col = position % 3;
    return position >= 0 && position < 9 && this.board[row][col] === EMPTY_POSITION;
  }

  /**
   * Place the move in the board, if move is valid.
   * @param position - Position in the board (0-8).
   * @param player - Playing that is placing the move (PLAYER_HUMAN or PLAYER_AI).
   * @returns - `true` if the move was placed successfully, `false` if it was not.
   */
  private placeMove(position: number, player: typeof PLAYER_AI | typeof PLAYER_HUMAN): boolean {
    if (!this.isPositionValid(position)) {
      if (player === PLAYER_HUMAN) {
        console.log("Invalid move. Try again.");
      }
      return false;
    }
    const row = Math.floor(position / 3);
    const col = position % 3;
    this.board[row][col] = player;
    return true;
  }

  /**
   * Ask the human player the desired move via console
   * @returns Promise with the desired position (0-8).
   */
  private async promptMove(): Promise<number> {
    return await new Promise(resolve => {   
      this.rl.question("Enter your move (0-8): ", (input) => resolve(Number(input)));
    });
  }

  /**
   * Return a list with available moves (empty) in the board.
   * @returns Object with the position and its value (0).
   */
  private getAvailableMoves(): { index: number, value: number }[] {
    const boardInput = this.board.flat();
    const validMoves = boardInput
      .map((value, index) => ({ index, value }))
      .filter(position => position.value === EMPTY_POSITION);
    return validMoves;
  }

  /**
   * Calculate the best move for the AI to play based on the return from Neural Network.
   * @returns index for the best position to play.
   */
  private getBestMoveFromAI(): number {
    const boardInput = this.board.flat();
    const output = this.neuralNetwork.forward(boardInput).output;
    const validMoves = this.getAvailableMoves();
    if (validMoves.length === 0 || output.length === 0) {
      return Math.floor(Math.random() * 9);
    }
    const bestMove = validMoves.reduce((best, current) => {
      if (output[current.index] > output[best.index]) {
        return current;
      }
      return best;
    });
    return bestMove.index;
  }

  /**
   * Execute the play for the current player (human or AI).
   * @returns Promise with void.
   */
  private async performMove(): Promise<void> {
    let position;
    if (this.currentPlayer === PLAYER_HUMAN) {
      position = await this.promptMove();
    } else {
      position = this.getBestMoveFromAI();
    }
    const success = this.placeMove(position, this.currentPlayer);
    if (!success) await this.performMove();
  }

  /**
   * Check if there is a winner in the board.
   * @returns `true` if there is a winner, `false` if there is not.
   */
  private checkVictory(): boolean {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // lines
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6] // diagonals];
    ];
    const flatBoard = this.board.flat();
    for (const [a, b, c] of lines) {
      if (
        flatBoard[a] !== EMPTY_POSITION &&
        flatBoard[a] === flatBoard[b] &&
        flatBoard[b] === flatBoard[c]
      ) {
        this.displayBoard();
        console.log("\n");
        console.log(flatBoard[a] === PLAYER_AI ? "AI WON." : "HUMAN WON.");
        return true;
      }
    }
    return false;
  }

  /**
   * Check if the board is fully filled.
   * @returns `ture` if it is fully filled, `false` if it is not.
   */
  private isBoardFull(): boolean {
    return this.board.flat().every((position) => position !== EMPTY_POSITION);
  }

  /**
   * Toggle current player between human and AI.
   * @returns void.
   */
  private togglePlayer(): void {
    this.currentPlayer = this.currentPlayer === PLAYER_HUMAN ? PLAYER_AI : PLAYER_HUMAN;
  }

  /**
   * Execute the game loop: display the board if current player is human, perform the move and toggle the player.
   * @returns Promise with void.
   */
  private async gameLoop(): Promise<void> {
    if (this.currentPlayer === PLAYER_HUMAN) {
      console.log("\n");
      this.displayBoard();
      console.log("\n");
    }
    await this.performMove();
    this.togglePlayer();
  }
  
  /**
   * Initialize and execute the game loop.
   * @returns Promise with void.
   */
  async run(): Promise<void> {
    this.rl = readline.createInterface({input, output});
    this.currentPlayer = PLAYER_HUMAN;
    this.resetBoard();
    console.log("Game is starting...");  
    while (!this.isBoardFull() && !this.checkVictory()) {
      await this.gameLoop();
    }
    this.rl.close();
  }
}

class NeuralNetwork {
  private inputToHiddenWeights: number[][];
  private hiddenToOutputWeights: number[][];

  constructor(
    private inputSize: number, 
    private hiddenSize: number, 
    private outputSize: number) {
      // weights connecting the input layer to the hidden layer
      this.inputToHiddenWeights = Array.from({ length: this.inputSize }, () =>
        Array.from({ length: this.hiddenSize }, () => Math.random())
      );
      
      // weights connecting the hidden layer to the output layer
      this.hiddenToOutputWeights = Array.from({ length: this.hiddenSize }, () =>
        Array.from({ length: this.outputSize }, () => Math.random())
      );
  }

  /**
   * Execute Neural Network forward propagation
   * @param input - Input vector (board state).
   * @returns Object with hidden raw (hidden layer after dot calculation and before activation), hidden (hidden layer after dot and activation), output raw (output layer after dot and before activation) and output (output layer after both dot and activation).
   */
  forward(input: number[]): {
    hiddenRaw: number[],
    hidden: number[],
    outputRaw: number[],
    output: number[],
  } {
    const hiddenRaw = this.dot(input, this.inputToHiddenWeights);
    const hidden = this.activate(hiddenRaw);
    const outputRaw = this.dot(hidden, this.hiddenToOutputWeights);
    const output = this.activate(outputRaw);
    return { hiddenRaw, hidden, outputRaw, output };
  }

  /**
   * Executes the full backpropagation algorithm to update the weights
   * of the neural network based on the difference between the predicted output
   * and the target (expected) output.
   * 
   * This function performs the following steps:
   * 1. Calculates the error at the output layer (difference between output and target)
   * 2. Calculates the output gradients using the derivative of the sigmoid
   * 3. Updates the weights from hidden → output layer
   * 4. Calculates the error of the hidden layer based on propagated output error
   * 5. Calculates the hidden gradients using the derivative of the sigmoid
   * 6. Updates the weights from input → hidden layer
   * 
   * @param input - Array of input values representing the current board state (length = inputSize)
   * @param target - Expected output values for this input (length = outputSize), e.g., ideal move
   * @param hidden - Activated values from the hidden layer (after sigmoid)
   * @param hiddenRaw - Raw dot product results from input → hidden (before sigmoid)
   * @param output - Activated values from the output layer (after sigmoid)
   * @param outputRaw - Raw dot product results from hidden → output (before sigmoid)
   * @param learningRate - Scalar factor controlling the weight update magnitude (typically 0.01–0.1)
   * 
   * @returns void
   */
  backPropagation(input: number[], target: number[], hidden: number[], hiddenRaw: number[], output: number[], outputRaw: number[], learningRate: number) {
    const outputErrors: number[] = output.map((outputValue, i) => outputValue - target[i]);
    const outputGradients: number[] =  outputErrors.map((error, i) => error * this.sigmoidDerivative(outputRaw[i]));
    hidden.forEach((node, i) => {
      outputGradients.forEach((gradient, j) => {
        this.hiddenToOutputWeights[i][j] -= learningRate * gradient * node;
      })
    });
    const hiddenErrors: number[] = this.hiddenToOutputWeights.map((weightsForHiddenNeuron) => {
      return weightsForHiddenNeuron.reduce((sum, weightToOutputNeuron, i) => {
        return sum + weightToOutputNeuron * outputGradients[i]
      }, 0);
    });
    const hiddenGradients: number[] = hiddenErrors.map((error, i) => {
      return error * this.sigmoidDerivative(hiddenRaw[i])
    });
    input.forEach((node, i) => {
      hiddenGradients.forEach((gradient, j) => {
        this.inputToHiddenWeights[i][j] -= learningRate * gradient * node;
      })
    })
  }

  /**
   * Mean Squared Error Loss Function implementation.
   * 
   * Calculate how much the Neural Network missed.
   * This is used to penalize the model and adjust the weights.
   * @returns number indicating the number representing the error.
   */
  mse(output: number[], target: number[]): number {
    const n = output.length;
    return output.reduce((sum, out, i) => {
      const error = target[i] - out;
      return sum + error ** 2
    }, 0) / n;
  }

  /**
    * Executes a single test iteration in the Neural Network
    *  
    * This method performs forward propagation, calculates the error
    * using the Mean Squared Error (MSE), and applies backpropagation
    * to update the weights based on the provided input and expected output.
    *
    * @param input - Vector representing current board state (flattened)
    * @param target - Vector representing the ideal move (1 at the ideal position, 0 elsewhere).
    * @param learningRate - Learning rate that determines how much the weights are adjusted.
    * @returns The error value (MSE) calculated for this iteration.
    */
  train(input: number[], target: number[], learningRate: number) {
    const { hidden, hiddenRaw, output, outputRaw } = this.forward(input);
    const loss = this.mse(output, target);
    this.backPropagation(
      input, 
      target, 
      hidden, 
      hiddenRaw, 
      output, 
      outputRaw, 
      learningRate
    );
    return loss;
  }

  /**
   * 
   * @param vector - input vector (some layer, as input or hidden).
   * @param matrix - matrix of weights (input to hidden, hidden to output).
   * @returns Vector resulting from the multiplication.
   */
  private dot(vector: number[], matrix: number[][]): number[] {
    return Array.from({ length: matrix[0].length }, (_, i) => 
      vector.reduce((sum, val, j) => sum += val * matrix[j][i], 0)
    );
  }

  /**
   * Apply sigmoid activation function to every element of a given vector.
   * @param vector - input vector (generally resultant from dot function).
   * @returns 
   */
  private activate(vector: number[]): number[] {
    return vector.map(this.sigmoid);
  }

  /**
   * Computes the sigmoid function for a given input value.
   * @param x - The raw input before applying the sigmoid.
   * @returns The sigmoid at x.
   */
  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }

  /**
   * Computes the derivative of the sigmoid function for a given input value.
   * @param x - The raw input before applying the derivative of the sigmoid.
   * @returns The derivative of the sigmoid at x.
   */
  private sigmoidDerivative(x: number): number {
    const sigmoid = this.sigmoid(x);
    return sigmoid * (1 - sigmoid);
  }
}

;(async function () {
  const neuralNetwork = new NeuralNetwork(9, 10, 9);
  
  // training parameters
  const EPOCHS: number = 100000;
  const LEARNING_RATE = 0.1;

  console.log("Traning Neural Network...");

  for (let epoch = 0; epoch < EPOCHS; epoch++) {
    trainingData.forEach(sample => {
      neuralNetwork.train(sample.input, sample.target, LEARNING_RATE);
    });

    if ((epoch + 1) % 1000 === 0) {
      const totalLoss = trainingData.reduce((sum, sample) => {
        const { output } = neuralNetwork.forward(sample.input);
        return sum + neuralNetwork.mse(output, sample.target);
      }, 0);
      const avgLoss = totalLoss / trainingData.length;
      console.log(`Epoch ${epoch + 1}: Average Loss = ${avgLoss.toFixed(4)}`);
    }
  }

  const game = new TicTacToe(neuralNetwork);
  while(true) await game.run();
})();
