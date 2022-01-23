const gameboard = (() => {
	let board = [];

	cells = document.getElementsByClassName('cell');
	for (let i = 0; i < cells.length; i++) {
		board.push(cells[i]);
	}

	return { board };
})();

let infoOne = document.getElementsByClassName('player-one')[0];
let infoTwo = document.getElementsByClassName('player-two')[0];
infoTwo.classList.remove('player-two');
const displayController = (() => {
	let sign = 'x';

	const changeSign = () => {
		if (sign === 'x') {
			infoOne.classList.remove('player-one');
			infoTwo.classList.add('player-two');
			sign = 'o';
		} else if (sign === 'o') {
			infoOne.classList.add('player-one');
			infoTwo.classList.remove('player-two');
			sign = 'x';
		}
	};

	const restartSign = () => {
		infoOne.classList.add('player-one');
		infoTwo.classList.remove('player-two');
		sign = 'x';
	};

	const getCurrentSign = () => {
		return sign;
	};

	const printSign = (target) => {
		if (target.textContent === '') {
			target.textContent = sign;
			target.classList.add(sign);
			changeSign();
		}
	};
	const deleteSign = (position) => {
		position.textContent = '';
		position.classList.remove('x');
		position.classList.remove('o');
	};
	return { printSign, restartSign, getCurrentSign, deleteSign };
})();

const Player = (name) => {
	let wins = 0;
	const getName = () => name;
	const getWins = () => wins;
	const hasWin = () => {
		wins++;
	};

	return { getName, getWins, hasWin };
};
playerOne = Player('Player One');
playerTwo = Player('Player Two');

const gameController = (() => {
	let cells = gameboard.board;
	let winText = document.getElementsByClassName('win-text')[0];
	let humanButton = document.getElementById('humanBtn');
	let AIEasyButton = document.getElementById('easyBtn');
	let AIDifficultButton = document.getElementById('difficultBtn');
	let gameOver = false;

	let currentDifficult = document.getElementsByClassName('active')[0];

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
		cells.forEach((cell) => {
			cell.textContent = '';
			cell.classList.remove('x');
			cell.classList.remove('o');
		});
		gameOver = false;
		displayController.restartSign();
		infoOne.textContent = playerOne.getName() + ': ' + playerOne.getWins();
		infoTwo.textContent = playerTwo.getName() + ': ' + playerTwo.getWins();
	};

	winText.addEventListener('click', () => {
		restartGame();
	});

	cells.forEach((cell) => {
		cell.addEventListener('click', (e) => cellClick(e));
	});

	const cellClick = (e) => {
		//console.log(currentDifficult.id);
		if (gameOver === false) {
			displayController.printSign(e.target);
			if (checkWin().winner != 'unknow') {
				isGameOver(checkWin().winner + ' Press here to restart the game!');
			}
		}
		if (currentDifficult.id == 'easyBtn' && gameOver === false) {
			easyMove();
			if (checkWin().winner != 'unknow') {
				isGameOver(checkWin().winner + ' Press here to restart the game!');
			}
		} else if (currentDifficult.id == 'difficultBtn' && gameOver === false) {
			difficultMove();
			if (checkWin().winner != 'unknow') {
				isGameOver(checkWin().winner + ' Press here to restart the game!');
			}
		}
	};

	const getAvailableMoves = (board) => {
		let availableSpace = [];
		for (let i = 0; i < board.length; i++) {
			if (board[i].textContent == '') {
				availableSpace.push(board[i]);
			}
		}
		return availableSpace;
	};

	const AIMakeMove = (move) => {
		displayController.printSign(move);
	};

	const easyMove = () => {
		let availableSpaces = getAvailableMoves(gameboard.board);
		let move;
		move = Math.floor(Math.random() * availableSpaces.length);
		AIMakeMove(availableSpaces[move]);
	};

	const difficultMove = () => {
		let bestScore = -Infinity;
		let move;
		getAvailableMoves(gameboard.board).forEach((space) => {
			displayController.printSign(space);
			let score = minimax(gameboard.board, 0, false);
			displayController.deleteSign(space);
			if (score > bestScore) {
				bestScore = score;
				move = space;
			}
		});
		displayController.printSign(move);
		displayController.restartSign();
	};

	const minimax = (board, depth, isMaximizing) => {
		if (checkWin().winner != 'unknow') {
			return checkWin().score;
		}

		if (isMaximizing) {
			let bestScore = -Infinity;

			getAvailableMoves(board).forEach((space) => {
				displayController.printSign(space);
				let score = minimax(board, depth + 1, false);
				displayController.deleteSign(space);
				bestScore = Math.max(score, bestScore);
			});
			return bestScore;
		} else {
			let bestScore = Infinity;

			getAvailableMoves(board).forEach((space) => {
				displayController.printSign(space);
				let score = minimax(board, depth + 1, true);
				displayController.deleteSign(space);
				bestScore = Math.min(score, bestScore);
			});
			return bestScore;
		}
	};

	//console.log(getAvailableMoves(gameboard.board));

	const isGameOver = (text) => {
		//console.log(displayController.getCurrentSign());
		if (displayController.getCurrentSign() === 'o') {
			//console.log('a');
			playerOne.hasWin();
		} else {
			playerTwo.hasWin();
		}

		gameOver = true;
		winText.textContent = text;
		//console.log(winText.textContent);
	};

	const checkWin = () => {
		let threeInARow = 0;
		let lastSign = gameboard.board[0].textContent;
		let winner = 'unknow';

		//check rows
		for (let i = 0; i < 9; i += 3) {
			lastSign = gameboard.board[i].textContent;
			threeInARow = 0;
			for (let j = 0; j < 3; j++) {
				if (gameboard.board[i + j].textContent != '') {
					if (lastSign == gameboard.board[i + j].textContent) {
						threeInARow++;
						//console.log(lastSign);
						//console.log(gameboard.board[i + j].textContent + (i + j));
					} else {
						lastSign = gameboard.board[i + j].textContent;
						threeInARow = 0;
					}
				}
			}
			if (threeInARow >= 3) {
				winner = lastSign;
			}
			//threeInARow = 0;
			//lastSign = gameboard.board[i].textContent;
			//console.log(lastSign + i);
		}

		threeInARow = 0;
		lastSign = gameboard.board[0].textContent;

		//check columns
		for (let i = 0; i < 3; i++) {
			threeInARow = 0;
			lastSign = gameboard.board[i].textContent;
			for (let j = 0; j < 9; j += 3) {
				if (gameboard.board[i + j].textContent != '') {
					if (lastSign == gameboard.board[i + j].textContent) {
						threeInARow++;
					} else {
						lastSign = gameboard.board[i + j].textContent;
						threeInARow = 0;
					}
				}
			}
			if (threeInARow >= 3) {
				winner = lastSign;
			}
		}

		threeInARow = 0;
		lastSign = gameboard.board[0].textContent;

		//check diagonals

		for (let i = 0; i < 9; i += 4) {
			if (gameboard.board[i].textContent != '') {
				if (lastSign == gameboard.board[i].textContent) {
					threeInARow++;
				} else {
					lastSign = gameboard.board[i].textContent;
					threeInARow = 0;
				}
			}
		}
		if (threeInARow >= 3) {
			winner = lastSign;
		} else {
			threeInARow = 0;
			lastSign = gameboard.board[2].textContent;

			for (let i = 2; i < 7; i += 2) {
				if (gameboard.board[i].textContent != '') {
					if (lastSign == gameboard.board[i].textContent) {
						threeInARow++;
						//console.log(threeInARow);
					} else {
						lastSign = gameboard.board[i].textContent;
						threeInARow = 0;
					}
				}
			}
			if (threeInARow >= 3) {
				winner = lastSign;
			}
		}

		//check a tie
		let cellsCounter = 0;
		for (let i = 0; i < gameboard.board.length; i++) {
			if (gameboard.board[i].textContent != '') {
				cellsCounter++;
			}
		}
		if (cellsCounter >= 9 && winner == 'unknow') {
			winner = "It's a tie!";
		}

		let score = winner == 'x' ? -1 : winner == 'o' ? 1 : 0;

		winner =
			winner == 'x'
				? playerOne.getName() + ' won!'
				: winner == 'o'
				? playerTwo.getName() + ' won!'
				: winner;

		//console.log(winner);

		return { winner, score };
	};
})();
