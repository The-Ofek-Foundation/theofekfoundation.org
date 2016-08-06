var docwidth, docheight;
var boardwidth, squarewidth;
var board;
var globalRoot;
var expansionConstant;
// bound: ~0.0156
var aiTurn;
var over;
var prevMove;
var xTurnGlobal;
var ponder, pondering;
var timeToThink;
var certaintyThreshold;
var wrapperTop;
var numChoose1, numChoose2, numChoose3, lnc1, lnc2, lnc3, stopChoose;
var anti;

var boardui = document.getElementById("board");
var brush = boardui.getContext("2d");

function pageReady() {
	docwidth = $("#content-wrapper").outerWidth(true);
	docheight = $("#content-wrapper").outerHeight(true);
	wrapperTop = $("#content-wrapper").position().top;

	boardwidth = docwidth < docheight ? docwidth:docheight;

	$('#board').width(boardwidth).height(boardwidth);
	$('#board').css('left', (docwidth - boardwidth) / 2);
	boardui.setAttribute('width', boardwidth);
	boardui.setAttribute('height', boardwidth);

	$('#new-game-btn').css('top', (docheight - $('#new-game-btn').height()) / 2);
	$('#new-game-btn').css('left', (docwidth - $('#new-game-btn').outerWidth()) / 2);
	$('#new-game-menu').css('top', (docheight - $('#new-game-menu').outerHeight()) / 2);
	$('#new-game-menu').css('left', (docwidth - $('#new-game-menu').outerWidth()) / 2);

	newGame();

	setTimeout(function() {
		let explainSettings = getLocallyStored('settingsExplained');
		if (!explainSettings) {
			alert("Type 's' to change your settings or 'n' to create a new game!");
			setLocallyStored('settingsExplained', true);
		}
	}, 100);
};

$(window).resize(function(event) {
	$("#content-wrapper").outerWidth($(window).outerWidth(true));
	$("#content-wrapper").outerHeight($(window).outerHeight(true) - $("#content-wrapper").position().top);

	docwidth = $("#content-wrapper").outerWidth(true);
	docheight = $("#content-wrapper").outerHeight(true);
	wrapperTop = $("#content-wrapper").position().top;

	boardwidth = docwidth < docheight ? docwidth:docheight;

	$('#board').width(boardwidth).height(boardwidth);
	$('#board').css('left', (docwidth - boardwidth) / 2);
	boardui.setAttribute('width', boardwidth);
	boardui.setAttribute('height', boardwidth);

	squarewidth = boardwidth / 9;

	drawBoard();
});

function newGame() {
	squarewidth = boardwidth / 9;

	adjustButtons();

	over = false;
	prevMove = false;
	board = new Array(9);
	for (var i = 0; i < board.length; i++) {
		board[i] = new Array(9);
		for (var a = 0; a < board[i].length; a++)
			board[i][a] = 0;
	}

	getSettings();
	populateSettingsForm(gameSettings.getSettings());

	expansionConstant = anti ? 1.581328125:1.03125;

	numChoose1 = numChoose2 = numChoose3 = lnc1 = lnc2 = lnc3 = stopChoose = false;

	xTurnGlobal = true;

	globalRoot = createMCTSRoot();
	drawBoard();

	if (((aiTurn === 'first') == xTurnGlobal) || aiTurn == 'both')
		setTimeout(playAIMove, 20);

	stopPonder();
	if (ponder)
		startPonder();
}

function getSettings() {
	aiTurn = gameSettings.getOrSet('aiTurn', 'second');
	ponder = gameSettings.getOrSet('ponder', false);
	anti = gameSettings.getOrSet('anti', false);
	timeToThink = gameSettings.getOrSet('timeToThink', 5);
}

function clearBoard() {
	brush.clearRect(0, 0, boardwidth, boardwidth);
}

function drawGrid() {
	if (prevMove && !over) {
		var nextCenter = [prevMove[0] % 3 * 3 + 1, prevMove[1] % 3 * 3 + 1];
		var nextCenterColor = board[nextCenter[0]][nextCenter[1]];
		if (nextCenterColor != 5 && nextCenterColor != 6 && nextCenterColor != 3 && nextCenterColor != 4 && xTurnGlobal) {
			brush.fillStyle = "rgba(102, 162, 255, 0.5)";
			brush.fillRect((nextCenter[0] - 1) * squarewidth, (nextCenter[1] - 1) * squarewidth, 3 * squarewidth, 3 * squarewidth);
		} else if (nextCenterColor != 5 && nextCenterColor != 6 && nextCenterColor != 3 && nextCenterColor != 4 && !xTurnGlobal) {
				brush.fillStyle = "rgba(255, 123, 123, 0.5)";
				brush.fillRect((nextCenter[0] - 1) * squarewidth, (nextCenter[1] - 1) * squarewidth, 3 * squarewidth, 3 * squarewidth);
		}
	}

	var i, a;
	brush.lineWidth = 5;
	brush.strokeStyle = "black";
	brush.beginPath();
	for (i = squarewidth * 3; i < boardwidth; i += squarewidth * 3) {
		brush.moveTo(i, 0);
		brush.lineTo(i, boardwidth);
	}
	for (a = squarewidth * 3; a < boardwidth; a += squarewidth * 3) {
		brush.moveTo(0, a);
		brush.lineTo(boardwidth, a);
	}
	brush.stroke();
	brush.closePath();

	brush.lineWidth = 1;
	brush.beginPath();
	for (i = squarewidth; i < boardwidth; i += squarewidth) {
		brush.moveTo(i, 0);
		brush.lineTo(i, boardwidth);
	}
	for (a = squarewidth; a < boardwidth; a += squarewidth) {
		brush.moveTo(0, a);
		brush.lineTo(boardwidth, a);
	}
	brush.stroke();
	brush.closePath();
}

function drawPiece(x, y) {
	var o4 = squarewidth / 4;
	var color;
	switch(board[x][y]) {
		case 1: case 3:
			color = 'x';
			break;
		case 2: case 4:
			color = 'o';
			break;
		case 5:
			color = 'X';
			break;
		case 6:
			color = 'O';
			break;
		default:
			return;
	}
	brush.textAlign = 'center';
	switch (color) {
		case 'x': case 'X':
			brush.fillStyle = "#1C86EE";
			break;
		case 'o': case 'O':
			o4 *= 1.1;
			brush.fillStyle = "red";
			break;
		default: return;
	}

	switch (color) {
		case 'x': case 'o':
			brush.font = squarewidth + "px Arial";
			brush.fillText(color + "", x * squarewidth + squarewidth / 2, (y + 1) * squarewidth - o4);
			break;
		case 'X': case 'O':
			brush.font = (squarewidth * 3) + "px Arial";
			brush.fillText(color + "", Math.floor(x / 3) * squarewidth * 3 + squarewidth * 1.5, Math.floor(y / 3 + 1) * squarewidth * 3 - o4 * 1.5);
			break;
		default: return;
	}
	brush.fill();
}
function drawBoard() {
	clearBoard();
	drawGrid();
	updateAnalysis();

	for (var I = 1; I < 9; I+=3)
		for (var A = 1; A < 9; A+=3)
			if (board[I][A] == 5 || board[I][A] == 6)
				drawPiece(I, A);
			else for (var i = I-1; i <= I+1; i++)
				for (var a = A-1; a <= A+1; a++)
					if (board[i][a] !== 0)
						drawPiece(i, a);
}

function drawHover(move) {
	board[move[0]][move[1]] = xTurnGlobal ? 1:2;
	drawBoard();
	board[move[0]][move[1]] = 0;
}

function getMove(xloc, yloc) {
	var left = (docwidth - boardwidth) / 2;
	if (xloc < left || xloc > left + boardwidth || yloc > boardwidth)
		return [-1, -1];
	return [(xloc - left) / squarewidth | 0, yloc / squarewidth | 0];
}

function legalMove(tboard, move, prevMove, output) {
	if (move[0] < 0 || move[1] < 0)
		return false;
	if (board[move[0]][move[1]] !== 0)
		return false;
	var c = tboard[move[0] - move[0] % 3 + 1][move[1] - move[1] % 3 + 1];
	if (c === 5 || c === 6 || c === 3 || c === 4) {
		if (output)
			alert("Square already finished");
		return false;
	}
	if (prevMove) {
		var center = tboard[prevMove[0] % 3 * 3 + 1][prevMove[1] % 3 * 3 + 1];
		if ((center != 5 && center != 6 && center != 3 && center != 4) && (prevMove[0] % 3 != Math.floor(move[0] / 3) || prevMove[1] % 3 != Math.floor(move[1] / 3))) {
			if (output)
				alert("Wrong square!");
			return false;
		}
	}
	return true;
}

function legalCenter(tboard, move) {
	let c = tboard[move[0] - move[0] % 3 + 1][move[1] - move[1] % 3 + 1];
	return !(c === 5 || c === 6 || c === 4 || c === 3);
}

function setTurn(turn, move) {
	var color = xTurnGlobal ? 5:6;
	if (gameOver(board, color, move))
		over = color;
	else if (tieGame(board))
		over = 'tie';

	xTurnGlobal = turn;
	prevMove = move;

	globalRoot = MCTSGetNextRoot(move);
	if (globalRoot)
		globalRoot.parent = null;
	else globalRoot = createMCTSRoot();

	numChoose1 = numChoose2 = numChoose3 = stopChoose = false;

//	 var mtc = mostTriedChild(globalRoot, null);

//	 if (!over && (turn === aiTurn || aiTurn == "both") && mtc && mtc.lastMove)
//		 drawHover(mtc.lastMove[0]);
//	 else	drawBoard();
	drawBoard();

	if (over) {
		setTimeout(function () {
			switch (over) {
				case 'tie':
					alert("Game tied!");
					break;
				case 5:
					if (anti)
						alert("O wins! (anti tic tac toe)");
					else alert("X wins!");
					break;
				case 6:
					if (anti)
						alert("X wins! (anti tic tac toe)");
					else alert ("O wins!");
					break;
			}
		}, 100);
		stopPonder();
	}

	if (!over && aiTurn !== 'null' && (turn === (aiTurn === 'first') || aiTurn == "both"))		setTimeout(playAIMove, 25);
}

$('#board').mousedown(function (e) {
	if (e.which === 3)
		return;
	if (aiTurn !== 'null' && xTurnGlobal == (aiTurn === 'first') || aiTurn == "both")		return;
	if (over) {
		alert("The game is already over!");
		return;
	}
	var move = getMove(e.pageX, e.pageY - wrapperTop);
	if (!legalMove(board, move, prevMove, true))
		return;

	playMove(board, move, xTurnGlobal);

	setTurn(!xTurnGlobal, move);
	e.preventDefault();
});

function playMove(tboard, move, xturn) {
	let color = xturn ? 1:2;
	let centerx = move[0] - move[0] % 3 + 1, centery = move[1] - move[1] % 3 + 1;
	let startx = move[0] - move[0] % 3, starty = move[1] - move[1] % 3;
	tboard[move[0]][move[1]] = color;
	if (localWin(tboard, color, move, startx, starty))
		tboard[centerx][centery] = color + 4;
	else if (squareFull(tboard, startx, starty))
		tboard[centerx][centery] += 2;
}

function localWin(tboard, color, move, startx, starty) {
	var i, a;

	for (var trial = 0; trial < 4; trial++) {
		cont:
		switch (trial) {
			case 0:
				for (i = startx; i < startx + 3; i++)
					if (tboard[i][move[1]] != color)
						break cont;
				return true;
			case 1:
				for (a = starty; a < starty + 3; a++)
					if (tboard[move[0]][a] != color)
						break cont;
				return true;
			case 2:
				if (move[0] % 3 != move[1] % 3)
					break;
				for (i = startx, a = starty; i < startx + 3; i++, a++)
					if (tboard[i][a] != color)
						break cont;
				return true;
			case 3:
				if (move[0] % 3 != 2 - move[1] % 3)
					break;
				for (i = startx, a = starty + 2; i < startx + 3; i++, a--)
					if (tboard[i][a] != color)
						break cont;
				return true;
		}
	}
	return false;
}

function squareFull(tboard, startx, starty) {
	for (var i = startx; i < startx + 3; i++)
		for (var a = starty; a < starty + 3; a++)
			if (tboard[i][a] === 0)
				return false;
	return true;
}

function gameOver(tboard, color, m) {
	var i, a;
	var move = [m[0] - m[0] % 3 + 1, m[1] - m[1] % 3 + 1];

	for (var trial = 0; trial < 4; trial++) {
		cont:
		switch (trial) {
			case 0:
				for (i = 1; i < 9; i+=3)
					if (tboard[i][move[1]] != color)
						break cont;
				return true;
			case 1:
				for (a = 1; a < 9; a+=3)
					if (tboard[move[0]][a] != color)
						break cont;
				return true;
			case 2:
				if (Math.floor(move[0] / 3) != Math.floor(move[1] / 3))
					break;
				for (i = 1, a = 1; i < 9; i+=3, a+=3)
					if (tboard[i][a] != color)
						break cont;
				return true;
			case 3:
				if (Math.floor(move[0] / 3) != 2 - Math.floor(move[1] / 3))
					break;
				for (i = 1, a = 7; i < 9; i+=3, a-=3)
					if (tboard[i][a] != color)
						break cont;
				return true;
		}
	}
	return false;
}

function tieGame(tboard) {
	for (var i = 1; i < 9; i+=3)
		for (var a = 1; a < 9; a+=3)
			if (tboard[i][a] != 3 && tboard[i][a] != 4 && tboard[i][a] != 6 && tboard[i][a] != 5)
				return false;
	return true;
}

$('#board').mousemove(function (e) {
	if (aiTurn !== 'null' && xTurnGlobal == (aiTurn === 'first') || aiTurn == "both" || over)		return;
	var move = getMove(e.pageX, e.pageY - wrapperTop);
	if (legalMove(board, move, prevMove, false))
		drawHover(move);
});

function updateAnalysis() {
	var range = getMCTSDepthRange();
	$('#anal').text("Analysis: Depth-" + range[1] + " Result-" + range[2] + " Certainty-" + (globalRoot && globalRoot.totalTries > 0 ? (resultCertainty(globalRoot) * 100).toFixed(0):"0") + "%");
	$('#num-trials').text("Trials: " + globalRoot.totalTries);
}

function resultCertainty(root) {
	if (root.totalTries > (root.hits + root.misses) * 3)
		return 1 - (root.hits + root.misses) / root.totalTries;
	else if (root.hits > root.misses)
		return (root.hits - root.misses) / root.totalTries;
	else if (root.hits < root.misses)
		return (root.misses - root.hits) / root.totalTries;
	else return 1 - (root.hits + root.misses) / root.totalTries;
}

function startPonder() {
	pondering = setInterval(function() {
		if (!globalRoot)
			globalRoot = createMCTSRoot();
		var startTime = new Date().getTime();
		var tempCount = 0;
		while ((new Date().getTime() - startTime) < 30 && !stopChoose) {
			globalRoot.chooseChild(onetotwod(twotooned(board)));
			tempCount++;
		}
		if (numChoose3 && (tempCount < numChoose3 / 9 || tempCount < numChoose2 / 9 || tempCount < numChoose1 / 9))
			stopChoose = true;
		else {
			numChoose3 = numChoose2;
			numChoose2 = numChoose1;
			numChoose1 = tempCount;
		}
		updateAnalysis();
	}, 1);
}

function stopPonder() {
	clearInterval(pondering);
}

function adjustButtons() {
	$('.footer button').css('font-size', squarewidth / 4);
	$('.footer').css("height", squarewidth / 2);
	$('.footer').css('margin-bottom', squarewidth / 4 - $('#back').outerHeight(false));
	$('.footer #anal').css('line-height', squarewidth / 2 + "px");
	$('.footer #num-trials').css('line-height', squarewidth / 2 + "px");
}

function newCookieId() {
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var cId;

	do {
		cId = "";
		for( var i=0; i < 5; i++)
				cId += possible.charAt(Math.floor(Math.random() * possible.length));
	} while (getCookie(cId));

	return cId;
}

function getMCTSDepthRange() {
	var root, range = new Array(3);
	for (range[0] = -1, root = globalRoot; root && root.children; range[0]++, root = leastTriedChild(root));
	for (range[1] = -1, root = globalRoot; root && root.children; range[1]++, root = mostTriedChild(root));
	root = globalRoot;
	if (root.totalTries > (root.hits + root.misses) * 3)
		range[2] = "Tie";
	else if ((root.hits > root.misses) == xTurnGlobal)
		range[2] = "X";
	else if ((root.hits < root.misses) == xTurnGlobal)
		range[2] = "O";
	else range[2] = "Tie";
	return range;
}

function setCookie(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires="+d.toUTCString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0)===0) c = c.substring(1);
				if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
		}
		return "";
}

function MCTSGetChildren(father, tboard) {
	var turn = father.turn;
	var children = [];
	var i, a;

	if (father.gameOver || tieGame(tboard))
		return [];

	if (father.lastMove) {
		var nextCenter = [father.lastMove[0] % 3 * 3 + 1, father.lastMove[1] % 3 * 3 + 1];
		var nextCenterColor = tboard[nextCenter[0]][nextCenter[1]];
		if (nextCenterColor != 5 && nextCenterColor != 6 && nextCenterColor != 3 && nextCenterColor != 4) {
			for (i = nextCenter[0] - 1; i <= nextCenter[0] + 1; i++)
				for (a = nextCenter[1] - 1; a <= nextCenter[1] + 1; a++)
					if (tboard[i][a] === 0)
						children.push(new MCTSNode(father, !turn, [i, a]));
			return children;
		}
	}
	else {
		for (i = 0; i < 9; i++)
			for (a = 0; a < 9; a++)
				children.push(new MCTSNode(father, !turn, [i, a]));
		return children;
	}

	for (var I = 1; I < 9; I+=3)
		for (var A = 1; A < 9; A+=3)
			if (tboard[I][A] != 5 && tboard[I][A] != 6 && tboard[I][A] != 3 && tboard[I][A] != 4)
				for (i = I-1; i <= I+1; i++)
					for (a = A-1; a <= A+1; a++)
						if (tboard[i][a] === 0)
							children.push(new MCTSNode(father, !turn, [i, a]));
	return children;
}

function MCTSSimulate(father, tboard) {
	if (father.gameOver || gameOver(tboard, father.turn ? 6:5, father.lastMove)) {
		father.gameOver = true;
		return anti ? 1:-1;
	}
	if (tieGame(tboard))
		return 0;

	var lm = father.lastMove, turn = father.turn, done = false;
	var nextCenter, nextCenterColor;
	var x, y, count;
	var swap = false;
	var tries;
	while (!done) {
		nextCenter = [lm[0] % 3 * 3 + 1, lm[1] % 3 * 3 + 1];
		nextCenterColor = tboard[nextCenter[0]][nextCenter[1]];
		count = 0;
		tries = 0;
		if (swap)
			if (nextCenterColor !== 5 && nextCenterColor !== 6 && nextCenterColor !== 3 && nextCenterColor !== 4) {
				for (x = nextCenter[0]-1; x <= nextCenter[0]+1; x++)
					for (y = nextCenter[1]-1; y <= nextCenter[1]+1; y++)
						if (tboard[x][y] === 0)
							count++;
				count = Math.random() * count | 0;
				outer:
				for (x = nextCenter[0]-1; x <= nextCenter[0]+1; x++)
					for (y = nextCenter[1]-1; y <= nextCenter[1]+1; y++)
						if (tboard[x][y] === 0)
							if (count === 0)
								break outer;
							else count--;
			}
			else {
				for (nextCenter[0] = 1; nextCenter[0] < 9; nextCenter[0] += 3)
					for (nextCenter[1] = 1; nextCenter[1] < 9; nextCenter[1] += 3) {
						nextCenterColor = tboard[nextCenter[0]][nextCenter[1]];
						if (nextCenterColor !== 5 && nextCenterColor !== 6 && nextCenterColor !== 3 && nextCenterColor !== 4)
							for (x = nextCenter[0]-1; x <= nextCenter[0]+1; x++)
								for (y = nextCenter[1]-1; y <= nextCenter[1]+1; y++)
									if (tboard[x][y] === 0)
										count++;
					}
				count = Math.random() * count | 0;
				outer1:
				for (nextCenter[0] = 1; nextCenter[0] < 9; nextCenter[0] += 3)
					for (nextCenter[1] = 1; nextCenter[1] < 9; nextCenter[1] += 3) {
						nextCenterColor = tboard[nextCenter[0]][nextCenter[1]];
						if (nextCenterColor !== 5 && nextCenterColor !== 6 && nextCenterColor !== 3 && nextCenterColor !== 4)
							for (x = nextCenter[0]-1; x <= nextCenter[0]+1; x++)
								for (y = nextCenter[1]-1; y <= nextCenter[1]+1; y++)
									if (tboard[x][y] === 0)
										if (count === 0)
											break outer1;
										else count--;
					}
			}
		else if (nextCenterColor !== 5 && nextCenterColor !== 6 && nextCenterColor !== 3 && nextCenterColor !== 4)
				do {
					x = nextCenter[0] - 1 + Math.random() * 3 | 0;
					y = nextCenter[1] - 1 + Math.random() * 3 | 0;
					tries++;
				}	while (tboard[x][y] !== 0);
			else do {
				x = Math.random() * 9 | 0;
				y = Math.random() * 9 | 0;
				tries++;
			}	while (!legalCenter(tboard, [x, y]));
		if (tries > 1)
			swap = true;
		playMove(tboard, [x, y], turn);
		done = gameOver(tboard, turn ? 5:6, [x, y]);
		if (tieGame(tboard))
			return 0;
		lm = [x, y];
		turn = !turn;
	}
	if ((turn === father.turn) !== anti)
		return -1;
	return 1;
}

function onetotwod(oned) {
	var twod = new Array(9);
	for (var i = 0; i < 9; i++)
		twod[i] = oned.slice(i * 9, (i + 1) * 9);
	return twod;
}

function twotooned(twod) {
	var oned = new Array(81);
	for (var i = 0; i < 81; i++)
		oned[i] = twod[i / 9 | 0][i % 9];
	return oned;
}

function createMCTSRoot() {
	return new MCTSNode(null, xTurnGlobal, prevMove);
}

function runMCTS(time) {
	if (!globalRoot)
		globalRoot = createMCTSRoot();
	var startTime = new Date().getTime();
	while ((new Date().getTime() - startTime) / 1E3 < time) {
		for (var i = 0; i < 1000; i++)
			globalRoot.chooseChild(onetotwod(twotooned(board)));
		var error = getCertainty(globalRoot);
		if (globalRoot.children.length < 2 || error < certaintyThreshold)
			return;
	}
	console.log("Total Simulations: " + globalRoot.totalTries);
}

function getCertainty(root) {
	var bestChild = mostTriedChild(root, null);
	var ratio = mostTriedChild(root, bestChild).totalTries / bestChild.totalTries;
	var ratioWins = bestChild.hits < bestChild.misses ? (bestChild.hits / bestChild.misses * 2):(bestChild.misses / bestChild.hits * 3);
	return ratio > ratioWins ? ratioWins:ratio;
}

function playAIMove() {
	runMCTS(timeToThink);
	fpaim();
}

function fpaim() {
	var bestMove = getBestMoveMCTS();
	playMove(board, bestMove, xTurnGlobal);
	setTurn(!xTurnGlobal, bestMove);
}

function getBestMoveMCTS() {
	var bestChild = mostTriedChild(globalRoot, null);
	if (!bestChild)
		return -1;
	return bestChild.lastMove;
}

function mostTriedChild(root, exclude) {
	var mostTrials = 0, child = null;
	if (!root.children)
		return null;
	if (root.children.length == 1)
		return root.children[0];
	for (var i = 0; i < root.children.length; i++)
		if (root.children[i] != exclude && root.children[i].totalTries > mostTrials) {
			mostTrials = root.children[i].totalTries;
			child = root.children[i];
		}
	return child;
}

function leastTriedChild(root) {
	var leastTrials = root.totalTries + 1, child = null;
	if (!root.children)
		return null;
	for (var i = 0; i < root.children.length; i++)
		if (root.children[i].totalTries < leastTrials) {
			leastTrials = root.children[i].totalTries;
			child = root.children[i];
		}
	return child;
}

function MCTSGetNextRoot(move) {
	if (!globalRoot || !globalRoot.children)
		return null;
	for (var i = 0; i < globalRoot.children.length; i++)
		if (globalRoot.children[i].lastMove[0] == move[0] && globalRoot.children[i].lastMove[1] == move[1]) {
			return globalRoot.children[i];
		}
	return null;
}

class MCTSNode {
	constructor(parent, turn, lastMove) {
		this.parent = parent;
		this.turn = turn;
		this.lastMove = lastMove;
		this.hits = 0;
		this.misses = 0;
		this.totalTries = 0;
	}

	chooseChild(board) {
		if (this.lastMove) {
			playMove(board, this.lastMove, !this.turn);
		}
		if (!this.children)
			this.children = MCTSGetChildren(this, board);
		if (this.children.length === 0) // leaf node
			this.runSimulation(board);
		else {
			var i;
			var countUnexplored = 0;
			for (i = 0; i < this.children.length; i++)
				if (this.children[i].totalTries === 0)
					countUnexplored++;

			if (countUnexplored > 0) {
				var ran = Math.floor(Math.random() * countUnexplored);
				for (i = 0; i < this.children.length; i++)
					if (this.children[i].totalTries === 0) {
						countUnexplored--;
						if (countUnexplored === 0) {
							playMove(board, this.children[i].lastMove, !this.children[i].turn);
							this.children[i].runSimulation(board);
							return;
						}
					}

			}
			else {
				var bestChild = this.children[0], bestPotential = MCTSChildPotential(this.children[0], this.totalTries), potential;
				for (i = 1; i < this.children.length; i++) {
					potential = MCTSChildPotential(this.children[i], this.totalTries);
					if (potential > bestPotential) {
						bestPotential = potential;
						bestChild = this.children[i];
					}
				}
				bestChild.chooseChild(board);
			}
		}
	}

	runSimulation(board) {
		this.backPropogate(MCTSSimulate(this, board));
	}

	backPropogate(simulation) {
		if (simulation > 0)
			this.hits++;
		else if (simulation < 0)
			this.misses++;
		this.totalTries++;
		if (this.parent)
			this.parent.backPropogate(-simulation);
	}
}

function MCTSChildPotential(child, t) {
	var w = child.misses - child.hits;
	var n = child.totalTries;
	var c = expansionConstant;

	return w / n	+	c * Math.sqrt(Math.log(t) / n);
}

function speedTest() {
	globalRoot = createMCTSRoot();
	var totalTrials, start = new Date().getTime();
	for (totalTrials = 0; totalTrials < 5E5; totalTrials++)
		globalRoot.chooseChild(onetotwod(twotooned(board)));
	console.log((new Date().getTime() - start) / 1E3);
}

function efficiencyTest() {
	speedTest();
	setInterval(function() {
		for (var i = 0; i < 1000; i++)
			globalRoot.chooseChild(onetotwod(twotooned(board)));
		$('#num-trials').text(globalRoot.totalTries);
	}, 1);
}

var t1;
function testExpansionConstants(c1, c2, numTrials, timeToThink, output) {
	var v1 = v2 = 0;
	t1 = [c1, c2];
	for (var I = 0; I < numTrials; I++) {
		over = false;
		prevMove = false;
		board = new Array(9);
		for (var i = 0; i < board.length; i++) {
			board[i] = new Array(9);
			for (var a = 0; a < board[i].length; a++)
				board[i][a] = 0;
		}

		xTurnGlobal = true;
		var r1 = createMCTSRoot(), r2 = createMCTSRoot();

		while (!over) {
			var startTime = new Date().getTime();
			var r = (I % 2 === 0) === xTurnGlobal ? r1:r2;
			expansionConstant = (I % 2 === 0) === xTurnGlobal ? c1:c2;
			if (!r)
				r = createMCTSRoot();
			while ((new Date().getTime() - startTime) / 1E3 < timeToThink) {
				for (var i = 0; i < 100; i++)
					r.chooseChild(onetotwod(twotooned(board)));
				var error = getCertainty(r);
				if (r.children.length < 2 || error < certaintyThreshold)
					break;
			}
			var bestChild = mostTriedChild(r, null);
			var bestMove = bestChild.lastMove;
			playMove(board, bestMove, xTurnGlobal);

			var color = xTurnGlobal ? 5:6;
			if (gameOver(board, color, bestMove))
				over = color;
			else if (tieGame(board))
				over = 'tie';

			xTurnGlobal = !xTurnGlobal;
			prevMove = bestMove;

			if (r1.children) {
				for (var i = 0; i < r1.children.length; i++)
					if (r1.children[i].lastMove[0] == bestMove[0] && r1.children[i].lastMove[1] == bestMove[1]) {
						r1 = r1.children[i];
						break;
					}
				r1.parent = null;
			}
			else r1 = createMCTSRoot();
			if (r2.children) {
				for (var i = 0; i < r2.children.length; i++)
					if (r2.children[i].lastMove[0] == bestMove[0] && r2.children[i].lastMove[1] == bestMove[1]) {
						r2 = r2.children[i];
						break;
					}
				r2.parent = null;
			}
			else r2 = createMCTSRoot();
			// console.log("next turn ", board);
		}
		switch (over) {
			case "tie":
				if (output)
					console.log("tie");
				break;
			case 5:
				if ((I % 2 === 0) !== anti) {
					v1++;
					if (output)
						console.log("c1 wins");
				}
				else {
					v2++;
					if (output)
						console.log("c2 wins");
				}
				break;
			case 6:
				if ((I % 2 === 0) !== anti) {
					v2++;
					if (output)
						console.log("c2 wins");
				}
				else {
					v1++;
					if (output)
						console.log("c1 wins");
				}
				break;
		}
	}
	console.log(c1 + ": " + v1 + " and " + c2 + ": " + v2);
	return [v1, v2];
}

function findBestExpansionConstant(seed, timeToThink, bound, numSimulations, prollyGreater) {
	console.log("!!!");
	console.log("Best constant: ", seed);
	console.log("Bound: ", bound);
	console.log("!!!");

	if (seed < 0)
		return;

	var delta1, delta2;

	var round1 = testExpansionConstants(seed, prollyGreater ? (seed + bound):(seed - bound), numSimulations, timeToThink, false);
	if (round1[1] > round1[0])
		findBestExpansionConstant(prollyGreater ? (seed + bound):(seed - bound), timeToThink, bound / 2, numSimulations, true);
	else {
		delta1 = round1[0] - round1[1];
		var round2 = testExpansionConstants(seed, prollyGreater ? (seed - bound):(seed + bound), numSimulations, timeToThink, false);
		if (round2[1] > round2[0])
			findBestExpansionConstant(prollyGreater ? (seed - bound):(seed + bound), timeToThink, bound / 2, numSimulations, true);
		else {
			delta2 = round2[0] - round2[1];
			findBestExpansionConstant(seed, timeToThink, bound / 2, numSimulations, delta1 < delta2 === prollyGreater);
		}
	}
}

$(document).keypress(function(event) {
	switch (event.which) {
		case 115: case 83: // s
			showSettingsForm();
			break;
		case 110: case 78: // n
			newGame();
			break;
	}
});

$('#done').click(function (event) {
	let settings = getNewSettings();
	gameSettings.setSettings(settings);
	hideSettingsForm();
	newGame();
});

$('#cancel').click(function (event) {
	hideSettingsForm();
	populateSettingsForm(gameSettings.getSettings());
});

$('#save').click(function (event) {
	let settings = getNewSettings();
	gameSettings.setSettings(settings);
	gameSettings.saveSettings(settings);
	hideSettingsForm();
	newGame();
});

function getNewSettings() {
	return {
		'ponder': document.getElementById('ponder').checked,
		'aiTurn': document.getElementById('ai-turn').value,
		'timeToThink': document.getElementById('time-to-think').value,
		'anti': document.getElementById('anti-tic-tac-toe').checked,
	}
}

function populateSettingsForm(settings) {
	document.getElementById('ponder').checked = settings.ponder;
	document.getElementById('ai-turn').value = settings.aiTurn;
	document.getElementById('time-to-think').value = settings.timeToThink;
	document.getElementById('anti-tic-tac-toe').checked = settings.anti;
}

function showSettingsForm() {
	$('#game-settings-menu').animate({opacity: 0.9}, "slow").css('z-index', 100);
}

function hideSettingsForm() {
	$('#game-settings-menu').animate({opacity: 0}, "slow").css('z-index', -1);
}
