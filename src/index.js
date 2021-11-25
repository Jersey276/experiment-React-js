import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button className={props.state} onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
    renderSquare(i) { 
      let state = 'square';
      if (this.props.winner != null) {
        if (this.props.winner.find((x) => x===i)) {
          state += ' winner'
        }
      }
      return (
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
          state={state}
        />
      );
    }
  
    render() {
      const board = [[1,2,3],[4,5,6],[7,8,9]];
      const render = board.map((row) =>
        <div className="board-row">
          {row.map((button) => 
            this.renderSquare(button)
          )
        }
        </div>
      )
      return (
        <div>
          {render}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [
          {
            squares: Array(9).fill(null),
            move: null
          }
        ],
        stepNumber: 0,
        xIsNext: true
      };
    }
  
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      let x =  Math.ceil(i/3);
      let y =  i%3;
      squares[i] = this.state.xIsNext ? "X" : "O";
      this.setState({
        history: history.concat([
          {
            squares: squares,
            move: {
              X: x,
              Y: (y>0?y:3)
            }
          }
        ]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        Chronoinv: false
      });
    }
  
    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0
      });
    }

    order() {
      this.setState({Chronoinv: !this.state.Chronoinv});
    }
  
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
  
      const moves = history.map((step, move) => {
        const desc = move ?
          'Revenir au tour n°' + move + '(' + step.move.X + ',' + step.move.Y + ')':
          'Revenir au début de la partie';
        return (
          <li key={move}>
            <button className={move===this.state.stepNumber?'current':''} onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });
  
      let status;
      if(winner) {
          status = "Winner: " + winner.winner;
      } else {
        if (this.state.stepNumber === 9) {
          status = "Match nul"
        } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }
      }
  
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={i => this.handleClick(i)}
              winner={winner!=null?winner.line:null}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <button onClick={() => this.order()}>Ordre</button>
            <ol className={this.state.Chronoinv?'inv':''}>
              {moves}
            </ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(<Game />, document.getElementById("root"));
  
  function calculateWinner(squares) {
    const lines = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      [1, 5, 9],
      [3, 5, 7]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
          winner : squares[a],
          line : [a,b,c]
        };
      }
    }
    return null;
  }
  