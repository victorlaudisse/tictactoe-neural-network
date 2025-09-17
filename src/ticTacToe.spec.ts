import { NeuralNetwork } from "./neuralNetwork";
import { TicTacToe } from "./ticTacToe";

let neuralNetwork: NeuralNetwork;
let game: any;
const EPOCHS: number = 100000;
const LEARNING_RATE: number = 0.1;
const mockTrainingData = [
  { input: [0,0,0,0,-1,0,0,0,0], target: [0,0,0,0,0,0,0,0,1] },
  { input: [0,0,0,0,-1,1,-1,0,0], target: [0,1,0,0,0,0,0,0,0] },
];

beforeAll(async () => {
  neuralNetwork = new NeuralNetwork(9, 10, 9);
  for (let epoch = 0; epoch < EPOCHS; epoch++) {
    mockTrainingData.forEach(sample => {
      neuralNetwork.train(sample.input, sample.target, LEARNING_RATE);
    });
  }
});

beforeEach(() => {
  game = new TicTacToe(neuralNetwork) as any;
});

describe("TicTacToe AI", () => {
  it("should return a valid move from AI", () => {
    game.board = [
      [0,  0, 0],
      [0, -1, 0],
      [0,  0, 0]
    ];
    const move = game.getBestMoveFromAI();
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThan(9);
    expect(move).not.toBe(4);
  });

  it("should return if the board is full", () => {
    game.board = [
      [1,  -1, -1],
      [-1, -1, 1],
      [1,  1, -1]
    ];
    expect(game.isBoardFull()).toBeTruthy();
  });

  it("should reset the board", () => {
    game.board = [
      [1,  -1, -1],
      [-1, -1, 1],
      [1,  1, -1]
    ];
    game.resetBoard();
    const expected = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    expect(game.board).toStrictEqual(expected);
  });

  it("should return that position is valid", () => {
    game.board = [
      [1, -1, 0],
      [0, 0, -1],
      [0, 0, 1]
    ];
    expect(game.isPositionValid(2)).toBeTruthy();
  });

  it("should return that position is not valid", () => {
    game.board = [
      [1, -1, 0],
      [0, 0, -1],
      [0, 0, 1]
    ];
    expect(game.isPositionValid(1)).toBeFalsy();
  })

  it("should place a move for human", () => {
    game.board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    const placedMove = game.placeMove(0, -1); 
    const expected = [
      [-1, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    expect(placedMove).toBeTruthy();
    expect(game.board).toStrictEqual(expected);
  });

  it("should place a move for AI", () => {
    game.board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    const placedMove = game.placeMove(0, 1); 
    const expected = [
      [1, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    expect(placedMove).toBeTruthy();
    expect(game.board).toStrictEqual(expected);
  });

  it("should not place a move for human", () => {
    game.board = [
      [1, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    const placedMove = game.placeMove(0, -1); 
    const expected = [
      [1, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    expect(placedMove).toBeFalsy();
    expect(game.board).toStrictEqual(expected);
  });

  it("should not place a move for AI", () => {
    game.board = [
      [-1, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    const placedMove = game.placeMove(0, 1); 
    const expected = [
      [-1, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    expect(placedMove).toBeFalsy();
    expect(game.board).toStrictEqual(expected);
  });

  it("should return just available moves", () => {
    game.board = [
      [-1, 1, 0],
      [0, 0, 1],
      [0, 0, -1]
    ];
    const expected = [
      { index: 2, value: 0 },
      { index: 3, value: 0 },
      { index: 4, value: 0 },
      { index: 6, value: 0 },
      { index: 7, value: 0 },
    ]
    expect(game.getAvailableMoves()).toStrictEqual(expected);
  });

  it("should check victory from human (diagonal)", () => {
    game.board = [
      [-1, 1, 0],
      [0, -1, 1],
      [0, 0, -1]
    ];
    expect(game.checkVictory()).toBeTruthy();
  });

  it("should check victory from human (horizontal)", () => {
    game.board = [
      [-1, -1, -1],
      [0, 1, 1],
      [0, 0, 1]
    ];
    expect(game.checkVictory()).toBeTruthy();
  });

  it("should check victory from human (vertical)", () => {
    game.board = [
      [-1, 1, 0],
      [-1, 1, 1],
      [-1, 0, -1]
    ];
    expect(game.checkVictory()).toBeTruthy();
  });

  it("should check victory from AI (diagonal)", () => {
    game.board = [
      [1, -1, -1],
      [-1, 1, 1],
      [0, 0, 1]
    ];
    expect(game.checkVictory()).toBeTruthy();
  });

  it("should check victory from AI (horizontal)", () => {
    game.board = [
      [1, -1, -1],
      [1, 1, 1],
      [0, -1, 0]
    ];
    expect(game.checkVictory()).toBeTruthy();
  });

  it("should check victory from AI (vertical)", () => {
    game.board = [
      [1, 0, -1],
      [1, 1, 0],
      [1, -1, -1]
    ];
    expect(game.checkVictory()).toBeTruthy();
  });

  it("should not check victory", () => {
    game.board = [
      [1, -1, 1],
      [-1, -1, 1],
      [0, 0, -1]
    ];
    expect(game.checkVictory()).toBeFalsy();
  });

  it("should toggle player", () => {
    game.currentPlayer = -1;
    game.togglePlayer();
    expect(game.currentPlayer).toBe(1);
  })

  describe("Predict moves", () => {
    it("should return 8 as move from AI", () => {
      game.board = [
        [0,  0, 0],
        [0, -1, 0],
        [0,  0, 0]
      ];
      const move = game.getBestMoveFromAI();
      expect(move).toBe(8);
    });
  
    it("should return 1 as move from AI", () => {
      game.board = [
        [0,  0, 0],
        [0, -1, 1],
        [-1,  0, 0]
      ];
      const move = game.getBestMoveFromAI();
      expect(move).toBe(1);
    });
  });
});