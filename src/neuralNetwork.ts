export class NeuralNetwork {
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