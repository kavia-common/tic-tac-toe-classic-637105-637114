import React, { useState, useCallback } from 'react';
import './App.css';

// PUBLIC_INTERFACE
const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

// PUBLIC_INTERFACE
const getComputerMove = (squares) => {
  // Simple AI: Look for first empty square
  const emptySquares = squares.reduce((acc, square, index) => 
    square === null ? [...acc, index] : acc, []);
  
  if (emptySquares.length === 0) return null;
  
  // Try to win or block opponent from winning
  const computerSymbol = 'O';
  const playerSymbol = 'X';
  
  // Check for potential winning moves
  for (const symbol of [computerSymbol, playerSymbol]) {
    for (const index of emptySquares) {
      const boardCopy = [...squares];
      boardCopy[index] = symbol;
      if (calculateWinner(boardCopy) === symbol) {
        return index;
      }
    }
  }
  
  // If no winning moves, try to take center, corners, then other squares
  const center = 4;
  const corners = [0, 2, 6, 8];
  
  if (squares[center] === null) return center;
  
  for (const corner of corners) {
    if (squares[corner] === null) return corner;
  }
  
  return emptySquares[Math.floor(Math.random() * emptySquares.length)];
};

// PUBLIC_INTERFACE
const Square = ({ value, onClick }) => (
  <button className="square" onClick={onClick}>
    {value}
  </button>
);

// PUBLIC_INTERFACE
const Board = ({ squares, onClick }) => (
  <div className="board">
    {squares.map((square, i) => (
      <Square key={i} value={square} onClick={() => onClick(i)} />
    ))}
  </div>
);

// PUBLIC_INTERFACE
function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [vsComputer, setVsComputer] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(square => square !== null);

  const handleClick = useCallback((i) => {
    if (calculateWinner(squares) || squares[i]) return;

    const newSquares = squares.slice();
    newSquares[i] = isXNext ? 'X' : 'O';
    setSquares(newSquares);

    if (vsComputer && !calculateWinner(newSquares)) {
      const computerMove = getComputerMove(newSquares);
      if (computerMove !== null) {
        newSquares[computerMove] = 'O';
      }
      setIsXNext(true);
    } else {
      setIsXNext(!isXNext);
    }

    const gameWinner = calculateWinner(newSquares);
    if (gameWinner) {
      setScores(prev => ({
        ...prev,
        [gameWinner]: prev[gameWinner] + 1
      }));
    }
  }, [squares, isXNext, vsComputer]);

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
  };

  const toggleGameMode = () => {
    setVsComputer(!vsComputer);
    resetGame();
    setScores({ X: 0, O: 0 });
  };

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isDraw) {
    status = "It's a draw!";
  } else {
    status = `Next player: ${isXNext ? 'X' : 'O'}`;
  }

  return (
    <div className="App">
      <div className="game-container">
        <div className="game-info">
          <div className="scores">
            <span>X: {scores.X}</span>
            <span>O: {scores.O}</span>
          </div>
          <button className="mode-toggle" onClick={toggleGameMode}>
            {vsComputer ? 'VS Player' : 'VS Computer'}
          </button>
        </div>
        
        <Board squares={squares} onClick={handleClick} />
        
        <div className="game-controls">
          <div className="status">{status}</div>
          <button className="reset-button" onClick={resetGame}>
            Reset Game
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
