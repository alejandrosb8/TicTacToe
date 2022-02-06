let currentTurn = 'x';

const Player = (name, sign) => {
	let wins = 0;
	const getName = () => name;
	const getWins = () => wins;
	const getSign = () => sign;
	const hasWin = () => {
		wins++;
	};

	return { getName, getWins, hasWin, getSign };
};
playerOne = Player('Player One', 'x');
playerTwo = Player('Player Two', 'o');

const gameboard = (() => {
	let board = [];

	const updateBoardClass = () => {
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (board[i][j].textContent == '') {
					board[i][j].classList.remove('x');
					board[i][j].classList.remove('o');
				} else {
					board[i][j].textContent == playerOne.getSign()
						? board[i][j].classList.add('x')
						: board[i][j].classList.add('o');
				}
			}
		}
	};

	const getBoard = () => {
		board = [];
		let cells = document.getElementsByClassName('cell');
		cells = Array.from(cells);

		for (let i = 0; i < 9; i += 3) {
			board.push(cells.slice(i, i + 3));
		}

		updateBoardClass();

		return board;
	};

	const eraseAll = () => {
		board = getBoard();
		board.forEach((row) => {
			row.forEach((column) => {
				column.textContent = '';
			});
		});
		updateBoardClass();
	};

	return { getBoard, updateBoardClass, eraseAll };
})();

const displayController = (() => {
	const printSign = (i, j, sign) => {
		let board = gameboard.getBoard();
		board[i][j].textContent = sign;
		gameboard.updateBoardClass();
	};

	const playerPrint = (target, sign) => {
		target.textContent = sign;
		gameboard.updateBoardClass();
	};

	return { printSign, playerPrint };
})();

const gameController = (() => {
	const changeTurn = () => {
		currentTurn = currentTurn == 'x' ? 'o' : 'x';
	};

	let winText = document.getElementsByClassName('win-text')[0];
	let humanButton = document.getElementById('humanBtn');
	let AIEasyButton = document.getElementById('easyBtn');
	let AIDifficultButton = document.getElementById('difficultBtn');
	let infoOne = document.getElementsByClassName('player-one')[0];
	let infoTwo = document.getElementsByClassName('player-two')[0];
	let gameOver = false;

	let currentDifficult = document.getElementsByClassName('active')[0];

	let scores = {
		x: -10,
		o: 10,
		tie: 0,
	};

	buttons = [humanButton, AIEasyButton, AIDifficultButton];

	buttons.forEach((button) => {
		button.addEventListener('click', (e) => changeDifficult(e));
	});

	const changeDifficult = (e) => {
		humanButton.classList.remove('active');
		AIEasyButton.classList.remove('active');
		AIDifficultButton.classList.remove('active');
		e.target.classList.add('active');
		currentDifficult = document.getElementsByClassName('active')[0];
		restartGame();
	};

	const restartGame = () => {
		winText.innerHTML = '<br />';
		gameboard.eraseAll();
		gameOver = false;
		infoOne.textContent = playerOne.getName() + ': ' + playerOne.getWins();
		infoTwo.textContent = playerTwo.getName() + ': ' + playerTwo.getWins();
		currentTurn = 'x';
	};

	winText.addEventListener('click', () => {
		restartGame();
	});

	gameboard.getBoard().forEach((row) => {
		row.forEach((colum) => {
			colum.addEventListener('click', (e) => cellClick(e));
		});
	});

	const cellClick = (e) => {
		if (gameOver === false && e.target.textContent == '') {
			displayController.playerPrint(e.target, currentTurn);
			if (currentDifficult.id == 'easyBtn') {
				easyMove();
			} else if (currentDifficult.id == 'difficultBtn') {
				if (availableCells(gameboard.getBoard()) >= 8) {
					easyMove();
				} else {
					difficultMove();
				}
			} else {
				changeTurn();
			}

			if (checkWinner() != null) {
				isGameOver(checkWinner());
			}
		}
	};

	const availableCells = (board) => {
		let available = 0;

		for (let i = 0; i < board.length; i++) {
			for (let j = 0; j < board[i].length; j++) {
				if (board[i][j].textContent == '') {
					available++;
				}
			}
		}

		return available;
	};

	const easyMove = () => {
		if (availableCells(gameboard.getBoard()) >= 1) {
			x = Math.floor(Math.random() * gameboard.getBoard().length);
			y = Math.floor(Math.random() * gameboard.getBoard()[x].length);

			while (gameboard.getBoard()[x][y].textContent != '') {
				x = Math.floor(Math.random() * gameboard.getBoard().length);
				y = Math.floor(Math.random() * gameboard.getBoard()[x].length);
			}
			displayController.printSign(x, y, 'o');
		}
	};

	const difficultMove = () => {
		if (availableCells(gameboard.getBoard()) >= 1) {
			let board = gameboard.getBoard();
			let bestScore = -Infinity;
			let move;
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					if (board[i][j].textContent == '') {
						board[i][j].textContent = 'o';
						let score = minimax(board, 0, false);
						console.log(score);
						board[i][j].textContent = '';
						if (score > bestScore) {
							bestScore = score;
							move = { i, j };
						}
					}
				}
			}
			displayController.printSign(move.i, move.j, 'o');
		}
	};

	const minimax = (board, depth, isMaximizing) => {
		let result = checkWinner();
		if (result !== null) {
			return scores[result];
		}

		if (isMaximizing) {
			let bestScore = -Infinity;
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					if (board[i][j].textContent == '') {
						board[i][j].textContent = 'o';
						let score = minimax(board, depth + 1, false);
						board[i][j].textContent = '';
						if (score > bestScore) {
							bestScore = score;
						}
					}
				}
			}
			return bestScore;
		} else {
			let bestScore = Infinity;
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					if (board[i][j].textContent == '') {
						board[i][j].textContent = 'x';
						let score = minimax(board, depth + 1, true);
						board[i][j].textContent = '';
						if (score < bestScore) {
							bestScore = score;
						}
					}
				}
			}
			return bestScore;
		}
	};

	const checkWinner = () => {
		let board = gameboard.getBoard();

		let threeInARow = 0;
		let lastSign = '';

		for (let i = 0; i < board.length; i++) {
			threeInARow = 0;
			lastSign = '';
			for (let j = 0; j < board[i].length; j++) {
				if (lastSign == board[i][j].textContent && lastSign != '') {
					threeInARow++;
					if (threeInARow >= 2) {
						return lastSign;
					}
				} else {
					threeInARow = 0;
					lastSign = board[i][j].textContent;
				}
			}
		}

		lastSign = '';

		for (let i = 0; i < board.length; i++) {
			threeInARow = 0;
			lastSign = '';
			for (let j = 0; j < board[i].length; j++) {
				if (lastSign == board[j][i].textContent && lastSign != '') {
					threeInARow++;
					if (threeInARow >= 2) {
						return lastSign;
					}
				} else {
					threeInARow = 0;
					lastSign = board[j][i].textContent;
				}
			}
		}

		lastSign = board[0][0].textContent;
		threeInARow = 0;
		for (let i = 0; i < board.length; i++) {
			if (lastSign == board[i][i].textContent && lastSign != '') {
				threeInARow++;
				if (threeInARow >= 3) {
					return lastSign;
				}
			}
		}

		lastSign = board[0][2].textContent;
		threeInARow = 0;
		let j = 2;
		for (let i = 0; i < board.length; i++) {
			if (lastSign == board[i][j].textContent && lastSign != '') {
				threeInARow++;
				if (threeInARow >= 3) {
					return lastSign;
				}
			}
			j--;
		}
		if (availableCells(gameboard.getBoard()) > 1) {
			return null;
		} else {
			return 'tie';
		}
	};

	const isGameOver = (winner) => {
		if (winner === 'x') {
			playerOne.hasWin();
		} else if (winner === 'o') {
			playerTwo.hasWin();
		}

		gameOver = true;

		if (winner != 'tie') {
			winText.textContent = winner + ' won!, press here to restart game.';
		} else {
			winText.textContent = "It's a tie!, press here to restart game.";
		}
	};
})();
