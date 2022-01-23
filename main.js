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

	return { printSign };
})();

const gameController = (() => {
	const changeTurn = () => {
		currentTurn == 'x' ? 'o' : 'x';
	};

	let winText = document.getElementsByClassName('win-text')[0];
	let humanButton = document.getElementById('humanBtn');
	let AIEasyButton = document.getElementById('easyBtn');
	let AIDifficultButton = document.getElementById('difficultBtn');
	let infoOne = document.getElementsByClassName('player-one')[0];
	let infoTwo = document.getElementsByClassName('player-two')[0];
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
		gameboard.eraseAll();
		gameOver = false;
		//displayController.restartSign();
		infoOne.textContent = playerOne.getName() + ': ' + playerOne.getWins();
		infoTwo.textContent = playerTwo.getName() + ': ' + playerTwo.getWins();
	};

	winText.addEventListener('click', () => {
		restartGame();
	});

	gameboard.getBoard().forEach((cell) => {
		cell.addEventListener('click', (e) => cellClick(e));
	});

	const cellClick = (e) => {
		//console.log(currentDifficult.id);
		if (gameOver === false) {
			console.log('a');
		}
	};
})();
