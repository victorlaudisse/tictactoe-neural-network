import * as readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import { NeuralNetwork } from "./neuralNetwork";

const PLAYER_HUMAN = -1;
const PLAYER_AI = 1;
const EMPTY_POSITION = 0;
const EMPTY_SYMBOL = "#";
const HUMAN_SYMBOL = "X";
const AI_SYMBOL = "O";

export class TicTacToe {
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