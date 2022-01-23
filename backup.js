cells = document.getElementsByClassName("cell");
let turn = "one";
let gameboard = [];
let gameover = false;
//function playerOne()

for (let i = 0; i < cells.length; i++) {
	gameboard.push(cells[i]);
	cells[i].addEventListener("click", (e) => cellPress(e));
}

function cellPress(e) {
	if (e.target.textContent == "" && gameover == false) {
		if (turn == "one") {
			e.target.textContent = "x";
			e.target.classList.add("cell-one");
			turn = "two";
		} else {
			e.target.textContent = "o";
			e.target.classList.add("cell-two");
			turn = "one";
		}
		checkWin();
	}
}

function checkWin() {
	let players = ["x", "o"];

	for (let p = 0; p < players.length; p++) {
		if (
			(gameboard[0].textContent == players[p] &&
				gameboard[1].textContent == players[p] &&
				gameboard[2].textContent == players[p]) ||
			(gameboard[3].textContent == players[p] &&
				gameboard[4].textContent == players[p] &&
				gameboard[5].textContent == players[p]) ||
			(gameboard[6].textContent == players[p] &&
				gameboard[7].textContent == players[p] &&
				gameboard[8].textContent == players[p]) ||
			(gameboard[0].textContent == players[p] &&
				gameboard[3].textContent == players[p] &&
				gameboard[6].textContent == players[p]) ||
			(gameboard[1].textContent == players[p] &&
				gameboard[4].textContent == players[p] &&
				gameboard[7].textContent == players[p]) ||
			(gameboard[2].textContent == players[p] &&
				gameboard[5].textContent == players[p] &&
				gameboard[8].textContent == players[p]) ||
			(gameboard[0].textContent == players[p] &&
				gameboard[4].textContent == players[p] &&
				gameboard[8].textContent == players[p]) ||
			(gameboard[2].textContent == players[p] &&
				gameboard[4].textContent == players[p] &&
				gameboard[6].textContent == players[p])
		) {
			gameover = true;
		}
	}
}
