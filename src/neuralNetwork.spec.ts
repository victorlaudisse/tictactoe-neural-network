import { NeuralNetwork } from "./neuralNetwork";

describe("NeuralNetwork", () => {
  it("should return output with correct length", () => {
    const nn = new NeuralNetwork(9, 10, 9);
    const input = [0,0,0,0,1,0,0,0,0];
    const result = nn.forward(input);
    expect(result.output).toHaveLength(9);
    expect(result.hidden).toHaveLength(10);
  });
});