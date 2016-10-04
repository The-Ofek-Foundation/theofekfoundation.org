var docwidth, docheight, gowidth;
var size;
var board, boards, captures;
var blackturn, boardon;
var wcaptures, bcaptures;
var second, seconds;
var i, a;
var ss; // square size
var maxTurn;
var blackPass;
var gameType = "Go";
var lastPiece, lastPieces;
var timer;
var gomokuAi = false;
var aiColor;
var aiDepth = 2;
var influenceAlright = false;
var aiMoveCheck = 10;
var expansionConst = 2;
var globalRoot;
var anti = false;
var boardTop, boardLeft;

var goban = document.getElementById("board");
var brush = goban.getContext("2d");

String.prototype.toMMSS = function () {
	var secNum = parseInt(this, 10); // don't forget the second param
	var minutes = Math.floor(secNum / 60);
	var seconds = secNum - (minutes * 60);

	if (minutes < 10) {minutes = "0"+minutes;}
	if (seconds < 10) {seconds = "0"+seconds;}
	var time = minutes+':'+seconds;
	return time;
};

function updateSecondDisplay() {
	$('#black-cntdwn').text(("" + second[0]).toMMSS());
	$('#white-cntdwn').text(("" + second[1]).toMMSS());
}

function countdown() {
	second[blackturn ? 0:1]--;
	updateSecondDisplay();
	if (second[blackturn ? 0:1] === 0) {
		alert((blackturn ? "White":"Black") + " wins on time!");
		clearInterval(timer);
	}
}

function logArray(arr) {
	for (i = 0; i < arr.length; i++)
		console.log(arr[i]);
}

function equal(board1, board2)	{
	for (i = 0; i < board.length; i++)
		for (a = 0; a < board[i].length; a++)
			if (board1[i][a] != board2[i][a])
					return false;
	return true;
}

function set(goban, from)	{
	for (i = 0; i < goban.length; i++)
		for (a = 0; a < goban[i].length; a++)
			goban[i][a] = from[i][a];
}

function saveCaptures(index, b, w)	{
	captures[index] = [b, w];
}

function saveSeconds(index, times)	{
	seconds[index] = JSON.parse(JSON.stringify(times));
}

function saveLastPiece(index) {
	lastPieces[index] = lastPiece;
}

function saveBoard(index, goban) {
	boards[index] = JSON.parse(JSON.stringify(goban));
	saveCaptures(index, bcaptures, wcaptures);
	saveSeconds(index, second);
	saveLastPiece(index);
}

function getCaptures(index)	{
	bcaptures = captures[index][0];
	wcaptures = captures[index][1];
	$('#black-stone').text(bcaptures);
	$('#white-stone').text(wcaptures);
}

function getSeconds(index)	{
	second = seconds[index];
}

function getLastPiece(index) {
	lastPiece = lastPieces[index];
}

function getBoard(index)	{
	getCaptures(index);
	getSeconds(index);
	getLastPiece(index);
	return boards[index];
}

function setTurn(bturn) {
	blackturn = bturn;
	var selectedStone = bturn ? $('#black-stone'):$('#white-stone');
	var otherStone = bturn ? $('#white-stone'):$('#black-stone');

	selectedStone.css('box-shadow', 'yellow 0px 0px 50px').css('background-color', '#FFFFA0');
	otherStone.css('box-shadow', 'none').css('background-color', 'rgba(0,0,0,0)');
}

function drawArc(x, y, radius) {
	brush.arc(x * ss + ss / 2, y * ss + ss / 2, radius, 0, Math.PI * 2);
}

function drawCircle(x, y, opacity) {
	switch(board[x][y]) {
			case 'W': brush.strokeStyle = "rgba(0, 0, 0, " + opacity + ")"; break;
		case 'B': brush.strokeStyle = "rgba(255, 255, 255, " + opacity + ")"; break;
		default: return;
	}
	brush.beginPath();
	brush.lineWidth = ss / 10;
	drawArc(x, y, ss * 0.22);
	brush.stroke();
}

function drawPiece(x, y, char, opacity) {
	switch (char)	{
		case 'B': brush.fillStyle = "rgba(0, 0, 0, " + opacity + ")"; break;
		case 'W': brush.fillStyle = "rgba(255, 255, 255, " + opacity + ")"; break;
		default: return;
	}
	brush.beginPath();
	brush.lineWidth = ss / 25;
	drawArc(x, y, ss * 0.4);
	brush.fill();
	brush.strokeStyle = "rgba(0, 0, 0, " + opacity + ")";
	brush.stroke();
}

function drawKeyPoints() {
	var quarter = Math.floor(Math.sqrt(size)) - 1;
	var half = (size - 1) / 2;
	brush.fillStyle = "black";
	brush.beginPath(); drawArc(half, half, ss * 0.17); brush.fill();
	brush.beginPath(); drawArc(quarter, quarter, ss * 0.17); brush.fill();
	brush.beginPath(); drawArc(half, quarter, ss * 0.17); brush.fill();
	brush.beginPath(); drawArc(quarter, half, ss * 0.17); brush.fill();
	brush.beginPath(); drawArc(size-quarter-1, size-quarter-1, ss * 0.17); brush.fill();
	brush.beginPath(); drawArc(size-quarter-1, quarter, ss * 0.17); brush.fill();
	brush.beginPath(); drawArc(quarter, size-quarter-1, ss * 0.17); brush.fill();
	brush.beginPath(); drawArc(size-quarter-1, half, ss * 0.17); brush.fill();
	brush.beginPath(); drawArc(half, size-quarter-1, ss * 0.17); brush.fill();
}

function clearCanvas() {
	brush.clearRect(0, 0, gowidth, gowidth);
}

function drawBoard(x, y, char) {
	clearCanvas();

	brush.beginPath();
	brush.lineWidth = 1;
	for (i = 1; i <= board.length; i++) {
		brush.moveTo(i * ss - ss / 2, 0);
		brush.lineTo(i * ss - ss / 2, gowidth);
	}
	for (a = 1; a <= board[0].length; a++) {
		brush.moveTo(0, a * ss - ss / 2);
		brush.lineTo(gowidth, a * ss - ss / 2);
	}
	brush.strokeStyle = "black";
	brush.stroke();

	drawKeyPoints();

	for (i = 0; i < board.length; i++)
		for (a = 0; a < board[i].length; a++)
			drawPiece(i, a, board[i][a], 1);

	if (char)
		drawPiece(x, y, char, 0.5);

	if (lastPiece)
		drawCircle(lastPiece[0], lastPiece[1], 1);

	updateSecondDisplay();
}

function identicalBoards(board1, board2) {
	var identical = true;
	var i, a;
	outer1:
	for (i = 0; i < board1.length; i++)
		for (a = 0; a < board1[i].length; a++)
			if (board1[i][a] != board2[i][board1[i].length - 1 - a]) {
				identical = false;
				break outer1;
			}
	if (identical)
		return true;

	identical = true;
	outer2:
	for (i = 0; i < board1.length; i++)
		for (a = 0; a < board1[i].length; a++)
			if (board1[i][a] != board2[board1.length - 1 - i][a]) {
				identical = false;
				break outer2;
			}
	if (identical)
		return true;

	identical = true;
	outer3:
	for (i = 0; i < board1.length; i++)
		for (a = 0; a < board1[i].length; a++)
			if (board1[i][a] != board2[board1.length - 1 - i][board1[i].length - 1 - a]) {
				identical = false;
				break outer3;
			}
	if (identical)
		return true;

	identical = true;
	outer4:
	for (i = 0; i < board1.length; i++)
		for (a = 0; a < board1[i].length; a++)
			if (board1[i][a] != board2[a][i]) {
				identical = false;
				break outer4;
			}
	if (identical)
		return true;

	identical = true;
	outer5:
	for (i = 0; i < board1.length; i++)
		for (a = 0; a < board1[i].length; a++)
			if (board1[i][a] != board2[a][board1.length - 1 - i]) {
				identical = false;
				break outer5;
			}
	if (identical)
		return true;

	identical = true;
	outer6:
	for (i = 0; i < board1.length; i++)
		for (a = 0; a < board1[i].length; a++)
			if (board1[i][a] != board2[board1[i].length - 1 - a][board1.length - 1 - i]) {
				identical = false;
				break outer6;
			}
	if (identical)
		return true;

	identical = true;
	outer7:
	for (i = 0; i < board1.length; i++)
		for (a = 0; a < board1[i].length; a++)
			if (board1[i][a] != board2[board1[i].length - 1 - a][i]) {
				identical = false;
				break outer7;
			}
	return identical;
}

function MCTSCheckGomokuWin(tboard, x, y) {
	var countConsecutive = 0;
	var color = 'null';
	for (i = x - 4; i <= x + 4; i++) // Horizontal
		if (i >= 0 && i < tboard.length && countConsecutive < 5)
			if (tboard[i][y] == color)
				countConsecutive++;
			else if (tboard[i][y] == 'B' || tboard[i][y] == 'W') {
				color = tboard[i][y];
				countConsecutive = 1;
			} else color = 'null';
		else if (countConsecutive == 5)
			return true;
	if (countConsecutive == 5)
		return true;

	countConsecutive = 0;
	color = 'null';

	for (a = y - 4; a <= y + 4; a++) // Vertical
		if (a >= 0 && a < tboard.length && countConsecutive < 5)
			if (tboard[x][a] == color)
				countConsecutive++;
			else if (tboard[x][a] == 'B' || tboard[x][a] == 'W') {
				color = tboard[x][a];
				countConsecutive = 1;
			} else color = 'null';
		else if (countConsecutive == 5)
			return true;
	if (countConsecutive == 5)
		return true;

	countConsecutive = 0;
	color = 'null';

	for (i = x - 4, a = y - 4; i <= x + 4; i++, a++) // diagonal 1 topleft - bottomright
		if (a >= 0 && a < tboard.length && i >= 0 && i < tboard[a].length && countConsecutive < 5)
			if (tboard[i][a] == color)
				countConsecutive++;
			else if (tboard[i][a] == 'B' || tboard[i][a] == 'W') {
				color = tboard[i][a];
				countConsecutive = 1;
			} else color = 'null';
		else if (countConsecutive == 5)
			return true;
	if (countConsecutive == 5)
		return true;

	countConsecutive = 0;
	color = 'null';

	for (i = x - 4, a = y + 4; i <= x + 4; i++, a--) // diagonal 1 topright - bottomleft
		if (a >= 0 && a < tboard.length && i >= 0 && i < tboard[a].length && countConsecutive < 5)
			if (tboard[i][a] == color)
				countConsecutive++;
			else if (tboard[i][a] == 'B' || tboard[i][a] == 'W') {
				color = tboard[i][a];
				countConsecutive = 1;
			} else color = 'null';
		else if (countConsecutive == 5)
			return true;
	if (countConsecutive == 5)
		return true;
}

function checkGomokuWin(x, y) {
	var countConsecutive = 0;
	var color = 'null';
	for (i = x - 4; i <= x + 4; i++) // Horizontal
		if (i >= 0 && i < board.length && countConsecutive < 5)
			if (board[i][y] == color)
				countConsecutive++;
			else if (board[i][y] == 'B' || board[i][y] == 'W') {
				color = board[i][y];
				countConsecutive = 1;
			} else color = 'null';
		else if (countConsecutive == 5)
			return true;
	if (countConsecutive == 5)
		return true;

	countConsecutive = 0;
	color = 'null';

	for (a = y - 4; a <= y + 4; a++) // Vertical
		if (a >= 0 && a < board.length && countConsecutive < 5)
			if (board[x][a] == color)
				countConsecutive++;
			else if (board[x][a] == 'B' || board[x][a] == 'W') {
				color = board[x][a];
				countConsecutive = 1;
			} else color = 'null';
		else if (countConsecutive == 5)
			return true;
	if (countConsecutive == 5)
		return true;

	countConsecutive = 0;
	color = 'null';

	for (i = x - 4, a = y - 4; i <= x + 4; i++, a++) // diagonal 1 topleft - bottomright
		if (a >= 0 && a < board.length && i >= 0 && i < board[a].length && countConsecutive < 5)
			if (board[i][a] == color)
				countConsecutive++;
			else if (board[i][a] == 'B' || board[i][a] == 'W') {
				color = board[i][a];
				countConsecutive = 1;
			} else color = 'null';
		else if (countConsecutive == 5)
			return true;
	if (countConsecutive == 5)
		return true;

	countConsecutive = 0;
	color = 'null';

	for (i = x - 4, a = y + 4; i <= x + 4; i++, a--) // diagonal 1 topright - bottomleft
		if (a >= 0 && a < board.length && i >= 0 && i < board[a].length && countConsecutive < 5)
			if (board[i][a] == color)
				countConsecutive++;
			else if (board[i][a] == 'B' || board[i][a] == 'W') {
				color = board[i][a];
				countConsecutive = 1;
			} else color = 'null';
		else if (countConsecutive == 5)
			return true;
	if (countConsecutive == 5)
		return true;
}

function gomokuShapeScore(consecutive, openEnds, currTurn) {
	switch (consecutive) {
		case 4:
			switch (openEnds) {
				case 0:
					return 0;
				case 1:
					if (currTurn)
						return 100000000;
					return 50;
				case 2:
					if (currTurn)
						return 100000000;
					return 500000;
			}
		case 3:
			switch (openEnds) {
				case 0:
					return 0;
				case 1:
					if (currTurn)
						return 7;
					return 5;
				case 2:
					if (currTurn)
						return 10000;
					return 50;
			}
		case 2:
			switch (openEnds) {
				case 0:
					return 0;
				case 1:
					return 2;
				case 2:
					return 5;
			}
		case 1:
			switch (openEnds) {
				case 0:
					return 0;
				case 1:
					return 0.5;
				case 2:
					return 1;
			}
		default:
			return 200000000;
	}
}

function analyzeGomokuColor(black, bturn, startx, endx, starty, endy) {
	var score = 0;
	var color = black ? 'B':'W';
	var countConsecutive = 0;
	var openEnds = 0;
	var x, y;

	for (i = startx; i < endx; i++) {
		for (a = starty; a < endy; a++) {
			if (board[i][a] == color)
				countConsecutive++;
			else if (board[i][a] == ' ' && countConsecutive > 0) {
				openEnds++;
				score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
				countConsecutive = 0;
				openEnds = 1;
			} else if (board[i][a] == ' ')
				openEnds = 1;
			else if (countConsecutive > 0) {
				score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
				countConsecutive = 0;
				openEnds = 0;
			} else openEnds = 0;
		}
		if (countConsecutive > 0)
			score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
		countConsecutive = 0;
		openEnds = 0;
	}

	for (a = starty; a < endy; a++) {
		for (i = startx; i < endx; i++) {
			if (board[i][a] == color)
				countConsecutive++;
			else if (board[i][a] == ' ' && countConsecutive > 0) {
				openEnds++;
				score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
				countConsecutive = 0;
				openEnds = 1;
			} else if (board[i][a] == ' ')
				openEnds = 1;
			else if (countConsecutive > 0) {
				score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
				countConsecutive = 0;
				openEnds = 0;
			} else openEnds = 0;
		}
		if (countConsecutive > 0)
			score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
		countConsecutive = 0;
		openEnds = 0;
	}

	for (x = startx; x < endx; x++) { // diagonal 1
		for (i = x, a = starty; i < endx && a < endy; i++, a++) {
			if (board[i][a] == color)
				countConsecutive++;
			else if (board[i][a] == ' ' && countConsecutive > 0) {
				openEnds++;
				score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
				countConsecutive = 0;
				openEnds = 1;
			} else if (board[i][a] == ' ')
				openEnds = 1;
			else if (countConsecutive > 0) {
				score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
				countConsecutive = 0;
				openEnds = 0;
			} else openEnds = 0;
		}
		if (countConsecutive > 0)
			score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
		countConsecutive = 0;
		openEnds = 0;
	}

	for (y = starty + 1; y < endy; y++) { // diagonal 1
		for (i = startx, a = y; i < endx && a < endy; i++, a++) {
			if (board[i][a] == color)
				countConsecutive++;
			else if (board[i][a] == ' ' && countConsecutive > 0) {
				openEnds++;
				score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
				countConsecutive = 0;
				openEnds = 1;
			} else if (board[i][a] == ' ')
				openEnds = 1;
			else if (countConsecutive > 0) {
				score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
				countConsecutive = 0;
				openEnds = 0;
			} else openEnds = 0;
		}
		if (countConsecutive > 0)
			score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
		countConsecutive = 0;
		openEnds = 0;
	}

	for (x = startx; x < endx; x++) { // diagonal 2
		for (i = x, a = starty; i >= startx && a < endy; i--, a++) {
			if (board[i][a] == color)
				countConsecutive++;
			else if (board[i][a] == ' ' && countConsecutive > 0) {
				openEnds++;
				score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
				countConsecutive = 0;
				openEnds = 1;
			} else if (board[i][a] == ' ')
				openEnds = 1;
			else if (countConsecutive > 0) {
				score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
				countConsecutive = 0;
				openEnds = 0;
			} else openEnds = 0;
		}
		if (countConsecutive > 0)
			score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
		countConsecutive = 0;
		openEnds = 0;
	}

	for (y = starty + 1; y < endy; y++) { // diagonal 2
		for (i = endx - 1, a = y; i >= startx && a < endy; i--, a++) {
			if (board[i][a] == color)
				countConsecutive++;
			else if (board[i][a] == ' ' && countConsecutive > 0) {
				openEnds++;
				score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
				countConsecutive = 0;
				openEnds = 1;
			} else if (board[i][a] == ' ')
				openEnds = 1;
			else if (countConsecutive > 0) {
				score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
				countConsecutive = 0;
				openEnds = 0;
			} else openEnds = 0;
		}
		if (countConsecutive > 0)
			score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
		countConsecutive = 0;
		openEnds = 0;
	}

	return score;
}

function MCTSAnalyzeGomokuColor(tboard, black, bturn, startx, endx, starty, endy) {
	var score = 0;
	var color = black ? 'B':'W';
	var countConsecutive = 0;
	var openEnds = 0;
	var x, y;

	for (i = startx; i < endx; i++) {
		for (a = starty; a < endy; a++) {
			if (tboard[i][a] == color)
				countConsecutive++;
			else if (tboard[i][a] == ' ' && countConsecutive > 0) {
				openEnds++;
				score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
				countConsecutive = 0;
				openEnds = 1;
			} else if (tboard[i][a] == ' ')
				openEnds = 1;
			else if (countConsecutive > 0) {
				score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
				countConsecutive = 0;
				openEnds = 0;
			} else openEnds = 0;
		}
		if (countConsecutive > 0)
			score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
		countConsecutive = 0;
		openEnds = 0;
	}

	for (a = starty; a < endy; a++) {
		for (i = startx; i < endx; i++) {
			if (tboard[i][a] == color)
				countConsecutive++;
			else if (tboard[i][a] == ' ' && countConsecutive > 0) {
				openEnds++;
				score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
				countConsecutive = 0;
				openEnds = 1;
			} else if (tboard[i][a] == ' ')
				openEnds = 1;
			else if (countConsecutive > 0) {
				score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
				countConsecutive = 0;
				openEnds = 0;
			} else openEnds = 0;
		}
		if (countConsecutive > 0)
			score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
		countConsecutive = 0;
		openEnds = 0;
	}

	for (x = startx; x < endx; x++) { // diagonal 1
		for (i = x, a = starty; i < endx && a < endy; i++, a++) {
			if (tboard[i][a] == color)
				countConsecutive++;
			else if (tboard[i][a] == ' ' && countConsecutive > 0) {
				openEnds++;
				score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
				countConsecutive = 0;
				openEnds = 1;
			} else if (tboard[i][a] == ' ')
				openEnds = 1;
			else if (countConsecutive > 0) {
				score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
				countConsecutive = 0;
				openEnds = 0;
			} else openEnds = 0;
		}
		if (countConsecutive > 0)
			score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
		countConsecutive = 0;
		openEnds = 0;
	}

	for (y = starty + 1; y < endy; y++) { // diagonal 1
		for (i = startx, a = y; i < endx && a < endy; i++, a++) {
			if (tboard[i][a] == color)
				countConsecutive++;
			else if (tboard[i][a] == ' ' && countConsecutive > 0) {
				openEnds++;
				score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
				countConsecutive = 0;
				openEnds = 1;
			} else if (tboard[i][a] == ' ')
				openEnds = 1;
			else if (countConsecutive > 0) {
				score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
				countConsecutive = 0;
				openEnds = 0;
			} else openEnds = 0;
		}
		if (countConsecutive > 0)
			score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
		countConsecutive = 0;
		openEnds = 0;
	}

	for (x = startx; x < endx; x++) { // diagonal 2
		for (i = x, a = starty; i >= startx && a < endy; i--, a++) {
			if (tboard[i][a] == color)
				countConsecutive++;
			else if (tboard[i][a] == ' ' && countConsecutive > 0) {
				openEnds++;
				score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
				countConsecutive = 0;
				openEnds = 1;
			} else if (tboard[i][a] == ' ')
				openEnds = 1;
			else if (countConsecutive > 0) {
				score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
				countConsecutive = 0;
				openEnds = 0;
			} else openEnds = 0;
		}
		if (countConsecutive > 0)
			score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
		countConsecutive = 0;
		openEnds = 0;
	}

	for (y = starty + 1; y < endy; y++) { // diagonal 2
		for (i = endx - 1, a = y; i >= startx && a < endy; i--, a++) {
			if (tboard[i][a] == color)
				countConsecutive++;
			else if (tboard[i][a] == ' ' && countConsecutive > 0) {
				openEnds++;
				score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
				countConsecutive = 0;
				openEnds = 1;
			} else if (tboard[i][a] == ' ')
				openEnds = 1;
			else if (countConsecutive > 0) {
				score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
				countConsecutive = 0;
				openEnds = 0;
			} else openEnds = 0;
		}
		if (countConsecutive > 0)
			score += gomokuShapeScore(countConsecutive, openEnds, bturn == black);
		countConsecutive = 0;
		openEnds = 0;
	}

	return score;
}


function analyzeGomoku(bturn) {
	return analyzeGomokuColor(true, bturn, 0, board.length, 0, board[0].length) - analyzeGomokuColor(false, bturn, 0, board.length, 0, board[0].length);
}

function MCTSAnalyzeGomoku(tboard, bturn) {
	return MCTSAnalyzeGomokuColor(tboard, true, bturn, 0, tboard.length, 0, tboard[0].length) - MCTSAnalyzeGomokuColor(tboard, false, bturn, 0, tboard.length, 0, tboard[0].length);
}

function analyzePieceWeightGomoku(bturn, x, y) {
	board[x][y] = bturn ? 'B':'W';
	var startx = x > 4 ? (x-4):0, starty = y > 4 ? (y-4):0;
	var endx = x < board.length - 5 ? (x+5):(board.length), endy = y < board[x].length - 5 ? (y+5):(board[x].length);
	var analysis = analyzeGomokuColor(bturn, !bturn, startx, endx, starty, endy);
	board[x][y] = ' ';
	return analysis - analyzeGomokuColor(bturn, !bturn, startx, endx, starty, endy);
}

function adjacent(iTemp, aTemp) {
	if (iTemp == (size - 1) / 2 && aTemp == iTemp)
		return true;

	var d = influenceAlright ? 2:1;

	for (i = iTemp - d; i <= iTemp + d; i++)
		for (a = aTemp - d; a <= aTemp + d; a++)
			if (i >= 0 && a >= 0 && i < board.length && a < board[i].length)
				if (board[i][a] != ' ')
					return true;

	return false;
}

function MCTSAdjacent(tboard, iTemp, aTemp) {
	if (iTemp == (size - 1) / 2 && aTemp == iTemp)
		return true;

	var d = influenceAlright ? 2:1;

	for (i = iTemp - d; i <= iTemp + d; i++)
		for (a = aTemp - d; a <= aTemp + d; a++)
			if (i >= 0 && a >= 0 && i < tboard.length && a < tboard[i].length)
				if (tboard[i][a] != ' ')
					return true;

	return false;
}

function insert(element, array) {
	array.splice(locationOf(element[0], array) + 1, 0, element);
	return array;
}

function locationOf(element, array, start, end) {
	start = start || 0;
	end = end || array.length;
	var pivot = parseInt(start + (end - start) / 2, 10);
	if (end-start <= 1 || array[pivot][0] === element) return pivot;
	if (array[pivot][0] < element) {
		return locationOf(element, array, pivot, end);
	} else {
		return locationOf(element, array, start, pivot);
	}
}

// function threatMoves() {


//	 for (var iTemp = 0; iTemp < board.length; iTemp++)
//		 for (var aTemp = 0; aTemp < board[iTemp].length; aTemp++)
//			 if (board[iTemp][aTemp] == ' ' && adjacent(iTemp, aTemp)) {
// }

function sortMoves(bturn) {
	var color = bturn ? 'B':'W';
	var analysis, analysis2;
	var sortedMoves = [];

	if (!anti) {
		var win = winningMove(bturn);
		if (win) {
			board[win[0]][win[1]] = color;
			analysis = analyzeGomoku(!bturn);
			board[win[0]][win[1]] = ' ';
			return [[analysis, win[0], win[1]]];
		} else win = winningMove(!bturn);
		if (win) {
			board[win[0]][win[1]] = color;
			analysis = analyzeGomoku(!bturn);
			board[win[0]][win[1]] = ' ';
			return [[analysis, win[0], win[1]]];
		}
	}

	for (var iTemp = 0; iTemp < board.length; iTemp++)
		for (var aTemp = 0; aTemp < board[iTemp].length; aTemp++)
			if (board[iTemp][aTemp] == ' ' && adjacent(iTemp, aTemp)) {
//				 board[iTemp][aTemp] = color;
//				 analysis = analyzeGomoku(!bturn);
//				 if (!bturn)
//					 analysis *= -1;
//				 board[iTemp][aTemp] = ' ';
//				 insert([analysis, iTemp, aTemp], sortedMoves);
				analysis = analyzePieceWeightGomoku(bturn, iTemp, aTemp);
				analysis2 = analyzePieceWeightGomoku(!bturn, iTemp, aTemp);
				insert([analysis < analysis2 ? analysis:analysis2, iTemp, aTemp], sortedMoves);
			}

	if (!anti && sortedMoves[sortedMoves.length-1][0] > 50000000)
		return [sortedMoves[sortedMoves.length-1]];
	return sortedMoves;
}

function possibleMoves(bturn) {
	var color = bturn ? 'B':'W';
	var analysis, analysis2;
	var sortedMoves = [];

	var win = winningMove(bturn);
	if (win) {
		board[win[0]][win[1]] = color;
		analysis = analyzeGomoku(!bturn);
		board[win[0]][win[1]] = ' ';
		return [[analysis, win[0], win[1]]];
	} else win = winningMove(!bturn);
	if (win) {
		board[win[0]][win[1]] = color;
		analysis = analyzeGomoku(!bturn);
		board[win[0]][win[1]] = ' ';
		return [[analysis, win[0], win[1]]];
	}

	for (var iTemp = 0; iTemp < board.length; iTemp++)
		for (var aTemp = 0; aTemp < board[iTemp].length; aTemp++)
			if (board[iTemp][aTemp] == ' ' && adjacent(iTemp, aTemp))
				sortedMoves.push([0, iTemp, aTemp]);
	return sortedMoves;
}

function winningMove(bturn) {
	var color = bturn ? 'B':'W';

	for (var iTemp = 0; iTemp < board.length; iTemp++)
		for (var aTemp = 0; aTemp < board[iTemp].length; aTemp++)
			if (board[iTemp][aTemp] == ' ' && adjacent(iTemp, aTemp)) {
				board[iTemp][aTemp] = color;
				if (checkGomokuWin(iTemp, aTemp)) {
					board[iTemp][aTemp] = ' ';
					return [iTemp, aTemp];
				}
				board[iTemp][aTemp] = ' ';
			}

	return false;
}

function MCTSWinningMove(tboard, bturn) {
	var color = bturn ? 'B':'W';

	for (var iTemp = 0; iTemp < tboard.length; iTemp++)
		for (var aTemp = 0; aTemp < tboard[iTemp].length; aTemp++)
			if (tboard[iTemp][aTemp] == ' ' && MCTSAdjacent(tboard, iTemp, aTemp)) {
				tboard[iTemp][aTemp] = color;
				if (MCTSCheckGomokuWin(tboard, iTemp, aTemp)) {
					tboard[iTemp][aTemp] = ' ';
					return [iTemp, aTemp];
				}
				tboard[iTemp][aTemp] = ' ';
			}
	return false;
}

function bestGomokuMove(bturn, depth) {
	var color = bturn ? 'B':'W';
	var xBest = -1, yBest = -1;
	var bestScore = bturn ? -1000000000:1000000000;
	var analysis;
	var blackResponse;
	var analTurn = depth % 2 === 0 ? bturn:!bturn;
	var sortedMoves;

//	 if (depth == 1)
//		 sortedMoves = possibleMoves(bturn);
	sortedMoves = sortMoves(bturn);

	for (var iTemp = sortedMoves.length-1; iTemp > sortedMoves.length - aiMoveCheck - 1 && iTemp >= 0; iTemp--) {
		var tempi = anti ? (sortedMoves.length - 1 - iTemp):iTemp;
		board[sortedMoves[tempi][1]][sortedMoves[tempi][2]] = color;
		if (depth == 1) {
			analysis = analyzeGomoku(analTurn);
			if (anti)
				analysis *= -1;
		} else {
			blackResponse = bestGomokuMove(!bturn, depth - 1);
			analysis = blackResponse[2];
		}
		board[sortedMoves[tempi][1]][sortedMoves[tempi][2]] = ' ';
		if ((analysis > bestScore && bturn) || (analysis < bestScore && !bturn)) {
			bestScore = analysis;
			xBest = sortedMoves[tempi][1];
			yBest = sortedMoves[tempi][2];
		}
	}

	return [xBest, yBest, bestScore];
}

function createMctsRoot() {
	return new MCTSNode(new State($.extend(true, [], board), blackturn), null, null, MCTSSimulate, MCTSGetChildren, expansionConst);
}

function MCTSSimulate(State) {
	var tempBoard = $.extend(true, [], State.board);
	var bturn = State.turn;

	if (MCTSCheckGomokuWin(tempBoard))
		return MCTSAnalyzeGomoku(tempBoard, bturn);

	return MCTSSimulateGame(tempBoard, bturn, bturn);
}

function MCTSSimulateGame(tboard, globalTurn, bturn) {
	influenceAlright = true;
	var lastMove, lastIndex, possibleMoves = MCTSGetPossibleMoves(tboard);
	influenceAlright = false;
	do {
		lastIndex = MCTSGetRandomMove(tboard, bturn, possibleMoves);
		lastMove = possibleMoves[lastIndex];
		tboard[lastMove[0]][lastMove[1]] = bturn ? 'B':'W';
		bturn = !bturn;
		MCTSDealWithPossibleMoves(possibleMoves, lastIndex, lastMove);
	} while (!MCTSCheckGomokuWin(tboard, lastMove[0], lastMove[1]) && possibleMoves.length > 0);
	return MCTSAnalyzeGomoku(tboard, globalTurn);
}

function MCTSGetRandomMove(tboard, bturn, possibleMoves) {
//	 var iwin = false, uwin = false;
//	 var i, a;
//	 for (i = 0; i < possibleMoves.length; i++) {
//		 tboard[possibleMoves[i][0]][possibleMoves[i][1]] = bturn ? 'B':'W';
//		 if (MCTSCheckGomokuWin(tboard, possibleMoves[i][0], possibleMoves[i][1])) {
//			 iwin = i;
//			 tboard[possibleMoves[i][0]][possibleMoves[i][1]] = ' ';
//			 break;
//		 }
//		 tboard[possibleMoves[i][0]][possibleMoves[i][1]] = bturn ? 'W':'B';
//		 if (MCTSCheckGomokuWin(tboard, possibleMoves[i][0], possibleMoves[i][1]))
//			 uwin = i;

//		 tboard[possibleMoves[i][0]][possibleMoves[i][1]] = ' ';
//	 }
//	 if (iwin)
//		 return iwin;
//	 if (uwin)
//		 return uwin;

	return Math.floor(Math.random() * possibleMoves.length);
}

function MCTSGetPossibleMoves(tboard) {
	var possibleMoves = [];
	for (var i = 0; i < tboard.length; i++)
		for (var a = 0; a < tboard[i].length; a++)
			if (tboard[i][a] == ' ')
				possibleMoves.push([i, a]);
	return possibleMoves;
}

function MCTSDealWithPossibleMoves(possibleMoves, lastIndex, lastMove) {
	possibleMoves.splice(lastIndex, 1);
}

function MCTSGetChildren(state, father) {
	var tempBoard = $.extend(true, [], state.board);
	var bturn = state.turn;
	var i, a;

	if (MCTSCheckGomokuWin(tempBoard))
		return [];

	var win = MCTSWinningMove(tempBoard, bturn);
	if (win) {
//		 console.log(win);
		tempBoard[win[0]][win[1]] = state.turn ? 'B':'W';
		return [new MCTSNode(new State(tempBoard, !bturn), father, win, MCTSSimulate, MCTSGetChildren, expansionConst)];
	} else win = MCTSWinningMove(tempBoard, !bturn);
	if (win) {
//		 console.log(win);
		tempBoard[win[0]][win[1]] = state.turn ? 'B':'W';
		return [new MCTSNode(new State(tempBoard, !bturn), father, win, MCTSSimulate, MCTSGetChildren, expansionConst)];
	}
	var possibleChildren = [];
	for (i = 0; i < tempBoard.length; i++)
		for (a = 0; a < tempBoard[i].length; a++)
			if (tempBoard[i][a] == ' ' && MCTSAdjacent(tempBoard, i, a)) {
				tempBoard[i][a] = state.turn ? 'B':'W';
				possibleChildren.push(new MCTSNode(new State($.extend(true, [], tempBoard), !bturn), father, [i, a], MCTSSimulate, MCTSGetChildren, expansionConst));
				tempBoard[i][a] = ' ';
			}
	for (i = 0; i < possibleChildren.length - 1; i++)
		for (a = i + 1; a < possibleChildren.length; a++)
			if (identicalBoards(possibleChildren[i].State.board, possibleChildren[a].State.board)) {
//				 console.log(possibleChildren);
				possibleChildren.splice(a, 1);
//				 console.log(possibleChildren);
				a--;
			}
//	 console.log("Final", possibleChildren);
	return possibleChildren;
}

function MCTSGetNextRoot(move) {
	if (!globalRoot || !globalRoot.children)
		return null;
	for (var i = 0; i < globalRoot.children.length; i++)
		if (globalRoot.children[i].lastMove[0] == move[0] && globalRoot.children[i].lastMove[1] == move[1]) {
			globalRoot.children[i].parent = null;
			return globalRoot.children[i];
		}
	return null;
}

function runMcts(times) {
	if (!globalRoot)
		globalRoot = createMctsRoot();
	for (var i = 0; i < times; i++)
		globalRoot.chooseChild();
	return globalRoot;
}

function getBestMoveMcts(simulate) {
	if (!globalRoot)
		return -1;
	if (simulate && globalRoot.totalTries < monteCarloTrials)
		runMcts(monteCarloTrials - globalRoot.totalTries);
	var bestMove, mostTrials = 0;
	for (var i = 0; i < globalRoot.children.length; i++)
		if (globalRoot.children[i].totalTries > mostTrials) {
			mostTrials = globalRoot.children[i].totalTries;
			bestMove = globalRoot.children[i].lastMove;
		}
	return bestMove;
}

function playAiTurnGomoku() {
	var bestMove = bestGomokuMove(blackturn, aiDepth);
	var analysis = bestMove[2];
	if (bestMove[0] < 0)
		bestMove = bestGomokuMove(blackturn, 1);
//	 console.log("heya");
//	 runMcts(10000);
//	 var bestMove = getBestMoveMcts(false);
//	 globalRoot = MCTSGetNextRoot(bestMove);
	board[bestMove[0]][bestMove[1]] = blackturn ? 'B':'W';
	lastPiece = [bestMove[0], bestMove[1]];
	saveBoard(boardon, board);
	boardon++;
	maxTurn = boardon;
	setTurn(!blackturn);
	blackPass = false;
	drawBoard();

	$('#gomoku-eval').text('Gomoku Evaluation: ' + analysis);

	if (checkGomokuWin(bestMove[0], bestMove[1])) {
		alert((blackturn ? "White":"Black") + " won!");
		return false;
	}
	return true;
}

function playAiBothGomoku() {
	setTimeout(function(){ if(playAiTurnGomoku()) playAiBothGomoku(); }, 20);
}

function newGame(length, handicap, starttime) {
	size = length;
	boardon = 0;
	boards = new Array(size * size * 2);
	captures = new Array(size * size * 2);
	captures[0] = [0, 0];
	seconds = new Array(size * size * 2);
	second = [starttime, starttime];
	seconds[0] = second;
	lastPieces = new Array(size * size * 2);
	lastPieces[0] = false;

	board = new Array(size);
	for (i = 0; i < board.length; i++) {
		board[i] = new Array(size);
		for (a = 0; a < board[i].length; a++)
			board[i][a] = ' ';
	}
	if (handicap > 1) {
		var quarter = Math.floor(Math.sqrt(size)) - 1;
		var half = (size - 1) / 2;
		setTurn(false);
		switch (handicap) {
			case 9:
				board[half][half] = 'B';
			case 8:
				board[half][quarter] = 'B';
			case 7:
				board[half][size-quarter-1] = 'B';
			case 6:
				board[quarter][quarter] = 'B';
				board[quarter][half] = 'B';
				board[quarter][size-quarter-1] = 'B';
				board[size-quarter-1][quarter] = 'B';
				board[size-quarter-1][half] = 'B';
				board[size-quarter-1][size-quarter-1] = 'B';
				break;
			case 5:
				board[half][half] = 'B';
			case 4:
				board[size-quarter-1][size-quarter-1] = 'B';
			case 3:
				board[quarter][quarter] = 'B';
			case 2:
				board[size-quarter-1][quarter] = 'B';
				board[quarter][size-quarter-1] = 'B';
				break;
			case 1:
				board[half][half] = 'B';
		}
	} else setTurn(true);
	boards[0] = board;
	wcaptures = bcaptures = 0;
	$('#black-stone').text(bcaptures);
	$('#white-stone').text(wcaptures);
	saveBoard(boardon, board);
	boardon++;
	maxTurn = boardon;
	blackPass = false;
	ss = gowidth / size;
	drawBoard();
	clearInterval(timer);
	timer = setInterval(function() { countdown(); }, 1000);

	if (gameType == 'Gomoku' && gomokuAi) {
		if (aiColor == 'Black')
			playAiTurnGomoku();
		else if (aiColor == 'Both')
			playAiBothGomoku();
	}
}

function pageReady() {

	docwidth = $("#content-wrapper").outerWidth(true);
	docheight = $("#content-wrapper").outerHeight(true);

	if (docwidth * 0.8 > docheight) {
		gowidth = docheight;
		$('#board').css('left', (docwidth * 0.8 - docheight)/3);
	} else gowidth = docwidth * 0.8;

	$('#board').width(gowidth).height(gowidth).css('top', (docheight - gowidth)/2);
	$('#settings-panel').width(docwidth - $('#board').outerWidth() - parseInt($('#board').css('left'), 10));

	goban.setAttribute('width', gowidth);
	goban.setAttribute('height', gowidth);

	boardTop = $("#content-wrapper").position().top + $("#board").position().top;
	boardLeft = $("#board").position().left;

	newGame(19, 0, 300);
};

$(window).resize(function(event) {
	$("#content-wrapper").outerWidth($(window).outerWidth(true));
	$("#content-wrapper").outerHeight($(window).outerHeight(true) - $("#content-wrapper").position().top);

	docwidth = $("#content-wrapper").outerWidth(true);
	docheight = $("#content-wrapper").outerHeight(true);

	if (docwidth * 0.8 > docheight) {
		gowidth = docheight;
		$('#board').css('left', (docwidth * 0.8 - docheight)/3);
	} else gowidth = docwidth * 0.8;

	$('#board').width(gowidth).height(gowidth).css('top', (docheight - gowidth)/2);
	$('#settings-panel').width(docwidth - $('#board').outerWidth() - parseInt($('#board').css('left'), 10));

	goban.setAttribute('width', gowidth);
	goban.setAttribute('height', gowidth);

	boardTop = $("#content-wrapper").position().top + $("#board").position().top;
	boardLeft = $("#board").position().left;

	ss = gowidth / size;

	drawBoard();
});

function checkDeadHelper(dead, killChar)	{
	var changed = false;
	for (i = 0; i < board.length; i++)
		for (a = 0; a < board[i].length; a++)
			if (dead[i][a] == -1) {
				if ((i > 0 && dead[i-1][a] === 0) || (i < size - 1 && dead[i+1][a] === 0) || (a > 0 && dead[i][a-1] === 0) || (a < size - 1 && dead[i][a+1] === 0)) {
					dead[i][a] = 0;
					changed = true;
					if (i > 0)
						i -= 1;
					if (a > 0)
						a -= 2;
				} else {
					if (i > 0 && board[i-1][a] == killChar && dead[i-1][a] != -1) {
						dead[i-1][a] = -1;
						changed = true;
					}
					if (i < size - 1 && board[i+1][a] == killChar && dead[i+1][a] != -1) {
						dead[i+1][a] = -1;
						changed = true;
					}
					if (a > 0 && board[i][a-1] == killChar && dead[i][a-1] != -1) {
						dead[i][a-1] = -1;
						changed = true;
					}
					if (a < size - 1 && board[i][a+1] == killChar && dead[i][a+1] != -1) {
						dead[i][a+1] = -1;
						changed = true;
					}
				}
			}

	return changed;
}

function checkDead(turn, x, y)	{
	var killChar = turn ? 'B':'W';
	var dead = new Array(size);
	for (i = 0; i < dead.length; i++) {
		dead[i] = new Array(size);
		for (a = 0; a < dead[i].length; a++) {
			if (board[i][a] == ' ')
				dead[i][a] = 0;
			else dead[i][a] = 1;
		}
	}

	if (board[x][y] == killChar)
		dead[x][y] = -1;
	else {
		if (x > 0 && board[x-1][y] == killChar)
			dead[x-1][y] = -1;
		if (x < size - 1 && board[x+1][y] == killChar)
			dead[x+1][y] = -1;
		if (y > 0 && board[x][y-1] == killChar)
			dead[x][y-1] = -1;
		if (y < size - 1 && board[x][y+1] == killChar)
			dead[x][y+1] = -1;
	}

	while (checkDeadHelper(dead, killChar));

	if (board[x][y] == killChar)
		for (i = 0; i < dead.length; i++)
			if (dead[i].indexOf(-1) >= 0) {
				if (confirm('Are you sure? This play is suicidal.'))
					break;
				else return false;
			}

	for (i = 0; i < dead.length; i++)
		for (a = 0; a < dead[i].length; a++)
			if (dead[i][a] == -1)	{
				board[i][a] = ' ';
				if (turn) wcaptures++;
				else bcaptures++;
			}
	return true;
}


function getCoord(loc) {
	return parseInt(loc / ss, 10);
}

function canPlaceHere(x, y, output) {
	if (board[x][y] != ' ') {
		if (output)
			alert("Illegal to place on stone!");
		return false;
	}
	return true;
}

$('#board').mousedown(function(e) { // place a piece
	if (e.which != 1) {
		drawBoard();
		return;
	}
	var x = getCoord(e.pageX - boardLeft);
	var y = getCoord(e.pageY - boardTop);

	if (canPlaceHere(x, y, false))
		board[x][y] = blackturn ? 'B':'W';
	else return;
	globalRoot = MCTSGetNextRoot([x, y]);


	if (gameType != "Gomoku") {
		checkDead(!blackturn, x, y);
		if(!checkDead(blackturn, x, y)) {
			board[x][y] = ' ';
			return;
		}
	}

	if (gameType != "Gomoku" && boardon > 3)
		if (equal(board, boards[boardon-2])) {
			set(board, getBoard(boardon-1));
			getCaptures(boardon-1);
			getSeconds(boardon-1);
			alert("Illegal ko move!");
			return;
		}

	lastPiece = [x, y];
	saveBoard(boardon, board);
	$('#black-stone').text(bcaptures);
	$('#white-stone').text(wcaptures);
	boardon++;
	maxTurn = boardon;
	setTurn(!blackturn);
	blackPass = false;
	drawBoard();

	$('#gomoku-eval').text('Gomoku Evaluation: ' + analyzeGomoku(blackturn));

	if (gameType != "Go" && checkGomokuWin(x, y))
		alert((blackturn ? "White":"Black") + " won!");
	else if (gameType == 'Gomoku' && gomokuAi)
		setTimeout(function(){ playAiTurnGomoku(); }, 20);
});

$('#board').mousemove(function(e) {
	var x = getCoord(e.pageX - boardLeft);
	var y = getCoord(e.pageY - boardTop);

	if (canPlaceHere(x, y, false))
		drawBoard(x, y, blackturn ? 'B':'W');
});

function convertTime(timeStr) {
	timeStr += '';
	var minutes = parseInt(timeStr.substring(0, timeStr.indexOf(':')), 10);
	var seconds = parseInt(timeStr.substring(timeStr.indexOf(':') + 1), 10);
	if (minutes > 59)
		minutes = 59;
	return minutes * 60 + seconds;
}

var dontSubmit = false;

$('#form-new-game').submit(function() {
	if (dontSubmit) {
		dontSubmit = false;
		return false;
	}

	gomokuAi = $('input[name="gomoku-ai"]').prop('checked');
	anti = $('input[name="anti-gomoku"]').prop('checked');
	gameType = $('input[name="game-types"]').val();
	aiColor = $('input[name="ai-color"]').val();
	aiDepth = $('input[name="ai-depth"]').val();

	newGame(parseInt($('input[name="board-size"]').val(), 10), parseInt($('input[name="handicap"]').val(), 10), convertTime($('input[name="time-control"]').val()));

	$('#new-game-menu').animate({opacity: 0}, "slow", function() {
		$(this).css('z-index', -1);
	});
	return false;
});

$('#btn-new-game').click(function() {
	$('#new-game-menu').animate({opacity: 1}, "slow").css('z-index', 1);
});

$('#btn-new-game-cancel').click(function() {
	dontSubmit = true;
	$('#new-game-menu').animate({opacity: 0}, "slow", function() {
		$(this).css('z-index', -1);
	});
});

$('#btn-undo').click(function() {
	if (boardon < 2) {
		alert("No moves to undo");
		return;
	} else {
		set(board, getBoard(boardon-2));
		boardon--;
		setTurn(!blackturn);
		$('#gomoku-eval').text('Gomoku Evaluation: ' + analyzeGomoku(blackturn));
	}
	drawBoard();
});

$('#btn-redo').click(function() {
	if (boardon >= maxTurn) {
		alert("No moves to redo");
		return;
	} else {
		set(board, getBoard(boardon));
		boardon++;
		setTurn(!blackturn);
		$('#gomoku-eval').text('Gomoku Evaluation: ' + analyzeGomoku(blackturn));
	}
	drawBoard();
});

$('#btn-pass').click(function() {
	if (blackturn)
		blackPass = true;
	else if (blackPass)
		alert("Game over!");
	setTurn(!blackturn);
	drawBoard();
});
