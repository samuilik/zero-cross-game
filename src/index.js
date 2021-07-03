import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button
      className={props.isWinCell ? "squareSelected" : "square"}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isWinCell={this.props.cells.includes(i)}
      />
    );
  }

  render() {
    const size = 3;
    var square = Array(size);
    for (let i = 0; i < size; i++) {
      var elements = Array(size);
      for (let j = 0; j < size; j++) {
        let element = this.renderSquare(i * size + j);
        elements.push(element);
      }
      let row = (
        <div key={i} className="board-row">
          {elements}
        </div>
      );
      square.push(row);
    }

    return <div>{square}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null), position: -1 }],
      xIsNext: true,
      stepNumber: 0,
      sortBy: true,
    };
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares: squares, position: i }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
      sortBy: this.state.sortBy,
    });
  }

  render() {
    const sortBy = this.state.sortBy;
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    var cells = [];
    const moves = history.map((step, move) => {
      const desc = move
        ? "Go to step #" +
          move +
          ", column #" +
          ((history[move].position % 3) + 1) +
          ", line #" +
          Math.ceil((history[move].position + 1) / 3)
        : "Go to start";

      return (
        <li key={move}>
          <button
            className={move === this.state.stepNumber ? "selected" : ""}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner is " + winner.sign;
      cells = winner.cells;
    } else if (this.state.stepNumber === 9) {
      status = "You played a draw!";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            cells={cells}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <button
              className={false ? "selected" : ""}
              onClick={() => {
                this.setState({ ...this.state, sortBy: !sortBy });
              }}
            >
              {"Sort"}
            </button>
          </div>
          <ol>{sortBy ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { sign: squares[a], cells: [a, b, c] };
    }
  }
  return null;
}

ReactDOM.render(<Game />, document.getElementById("root"));
