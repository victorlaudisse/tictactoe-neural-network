# 🧠 Tic Tac Toe Neural Network - Projeto de Rede Neural do Zero (Node.js)

Este projeto demonstra a criação de uma **Rede Neural Artificial (RNA) implementada 100% do zero** em Node.js, com o objetivo de ensinar uma IA a jogar **jogo da velha (Tic Tac Toe)** com base em exemplos. Não foram utilizadas bibliotecas de machine learning.

Ele serve como estudo didático para quem deseja compreender na prática:
- Como funciona uma rede neural feedforward
- Como aplicar backpropagation para aprendizado
- Como aplicar IA em jogos com lógica baseada em probabilidade

---

## 🧩 Estrutura da Rede Neural

### Arquitetura:

| Camada  | Tamanho | Função                                       |
|---------|---------|-----------------------------------------------|
| Input   | 9       | Representa o estado do tabuleiro (3x3 achatado) |
| Hidden  | 10      | Camada intermediária para aprendizado          |
| Output  | 9       | Um neurônio para cada posição do tabuleiro     |

### Componentes:
- **Pesos:** são iniciados de forma aleatória e ajustados durante o treinamento.
- **Ativação:** utiliza-se a função **sigmoid**.
- **Erro:** calculado com **MSE (Mean Squared Error)**.
- **Aprendizado:** realizado via **backpropagation**.


## 🎮 Jogo da Velha Integrado

A IA interage com um jogo da velha via terminal. O humano joga contra a IA, e a jogada da IA é escolhida com base nas **saídas da rede neural**:

1. O tabuleiro atual é transformado em vetor com `flat()`.
2. A IA recebe esse vetor como entrada.
3. A rede retorna 9 valores entre 0 e 1 (probabilidades).
4. A IA joga na posição válida com maior probabilidade.


## 🚀 Forward Propagation

Processo onde os dados fluem da entrada até a saída. Implementado na função `forward()`:

- Multiplicação input × pesos de entrada
- Aplica sigmoid
- Multiplica hidden × pesos de saída
- Aplica sigmoid

A saída final é o vetor de 9 probabilidades.

```ts
const result = network.forward([0,0,-1,0,1,0,-1,0,0]);
// result.output -> [0.01, 0.87, 0.04, ...] (exemplo)
```


## ❌ Função de Erro: MSE

A função de custo utilizada foi o **erro quadrático médio (MSE)**:

```ts
mse = Σ(target[i] - output[i])^2 / n
```

O MSE serve como base para calcular os gradientes e ajustar os pesos. Quanto menor o MSE, melhor a performance da rede.


## 🔁 Backpropagation

Ajusta os pesos com base no erro calculado.

### Etapas:

1. Calcula o **erro da saída** (output - target)
2. Calcula o **gradiente da saída** (erro × sigmoid')
3. Atualiza os pesos **hidden → output**
4. Propaga erro para a hidden layer
5. Calcula o gradiente da hidden
6. Atualiza os pesos **input → hidden**

Tudo isso com base na taxa de aprendizado (learning rate).


## 🏋️ Treinamento

Durante a execução, a IA passa por um ciclo de treinamento com exemplos pré-definidos:

```ts
const trainingData = [
  {
    input: [-1,0,0,0,1,0,0,0,-1],
    target: [0,1,0,0,0,0,0,0,0]
  },
  {
    input: [0,0,-1,0,1,0,-1,0,0],
    target: [0,1,0,0,0,0,0,0,0]
  },
  // ...
];

for (let epoch = 0; epoch < 100_000; epoch++) {
  trainingData.forEach(({ input, target }) => {
    neuralNetwork.train(input, target, 0.1);
  });
}
```

- Foram utilizadas **múltiplas épocas** (iterações) para otimizar os pesos.
- O modelo treina **antes do jogo começar**, e aplica o conhecimento aprendido.
- O conjunto de `trainingData` foi cuidadosamente construído com **jogadas estratégicas**.


## 🧠 Inteligência Aprendida

Após o treinamento:
- A IA evita perder mesmo em situações críticas
- Aprende a bloquear jogadas e priorizar o centro
- Em muitas situações, se torna quase **invencível**

> A rede aprende puramente por padrões matemáticos, sem codificar regras fixas.


## 📌 Possíveis Expansões

- Adicionar **bias** (deslocamento dos neurônios)
- Permitir que a IA aprenda **depois de perder**
- Persistir os pesos em **arquivo JSON** para manter o aprendizado
- Interface gráfica com Canvas ou React
- Treinamento com **jogadas humanas reais**


## 📄 Como Executar

```bash
git clone https://github.com/seu-usuario/tic-tac-toe-neural-network.git
cd tic-tac-toe-neural-network
npm install
npm run game
```

O terminal exibirá o tabuleiro e permitirá que você jogue contra a IA.


## 📝 Licença

MIT. Feito para estudo e aprendizado.

---

Desenvolvido com dedicação por **Victor Laudisse**.
Se curtiu, me segue no [LinkedIn](https://www.linkedin.com/in/victorlaudisse/) :)

