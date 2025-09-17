
import { NeuralNetwork } from "./neuralNetwork";
import { TicTacToe } from "./ticTacToe";
import { trainingData } from "./training-data";

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
