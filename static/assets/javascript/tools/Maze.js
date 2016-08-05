var docwidth, docheight;
var mazewidth, mazeheight;
var dimensions = new Array(2);
var blockWidth = 8;
var maze;
var startx, starty;
var mazeStyle = "normal";
var styleIntensity = 8;
var startMaze = new Array(2);
var endMaze = new Array(2);
var animate = false;
var animation, animationOn, animationInterval;
var totalAnimationTime = 30;
var customResolution = false;
var showStartEnd = true;
var thinMaze = false;
var visited, correctPath;
var deadVisited;

var mazeui = document.getElementById("maze");
var brush = mazeui.getContext("2d");

function pageReady() {
	$("#maze-tr-div").css('top', $("#content-wrapper").position().top);
	docwidth = $("#content-wrapper").outerWidth(true);
	docheight = $("#content-wrapper").outerHeight(true);
	mazewidth = mazeheight = docwidth < docheight ? docwidth:docheight;
	dimensions[0] = 23;
	dimensions[1] = 23;

	resizeMaze();
	generateMaze();
};

function resizeMaze() {
	var recBlockWidth;
	recBlockWidth = docwidth / dimensions[0] < docheight / dimensions[1] ? (docwidth / dimensions[0]):(docheight / dimensions[1]);
	if (!customResolution)
		blockWidth = (docwidth / dimensions[0] < docheight / dimensions[1] ? (docwidth / dimensions[0] | 0):(docheight / dimensions[1] | 0));
	mazewidth = blockWidth * dimensions[0];
	mazeheight = blockWidth * dimensions[1];
	var recwidth = recBlockWidth * dimensions[0];
	var recheight = recBlockWidth * dimensions[1];

	$('#maze').width(recwidth).height(recheight).css('left', (docwidth - recwidth) / 2).css('top', (docheight - recheight) / 2);
	mazeui.setAttribute('width', mazewidth);
	mazeui.setAttribute('height', mazeheight);

	$('#new-game-menu').css('top', (docheight - $('#new-game-menu').outerHeight()) / 2);
	$('#new-game-menu').css('left', (docwidth - $('#new-game-menu').outerWidth()) / 2);
}

$(window).resize(function() {
	$("#content-wrapper").outerWidth($(window).outerWidth(true));
	$("#content-wrapper").outerHeight($(window).outerHeight(true) - $("#content-wrapper").position().top);

	$("#maze-tr-div").css('top', $("#content-wrapper").position().top);

	docwidth = $("#content-wrapper").outerWidth(true);
	docheight = $("#content-wrapper").outerHeight(true);
	resizeMaze();
	drawMaze();
});


function clearMaze() {
	brush.clearRect(0, 0, mazewidth, mazeheight);
	brush.beginPath();
	brush.rect(0, 0, mazewidth, mazeheight);
	brush.fillStyle = "white";
	brush.fill();
	brush.closePath();
}

function drawMaze() {
	if (thinMaze) {
		drawMaze2();
		return;
	}
	var i, a;
	clearMaze();
	brush.beginPath();
	for (i = 0; i < maze.length; i++)
		for (a = 0; a < maze[i].length; a++)
			if (maze[i][a] == 1)
				rect(i, a);
	brush.fillStyle = "black";
	brush.fill();
	brush.closePath();

	brush.beginPath();
	for (i = 0; i < maze.length; i++)
		for (a = 0; a < maze[i].length; a++)
			if (maze[i][a] == 2)
				rect(i, a);
	brush.fillStyle = "blue";
	brush.fill();
	brush.closePath();

	if (visited) {
		brush.beginPath();
		for (i = 0; i < maze.length; i++)
			for (a = 0; a < maze[i].length; a++)
				if (correctPath[i][a])
					rect(i, a);
		brush.fillStyle = "yellow";
		brush.fill();
		brush.closePath();
	}

	if (showStartEnd)
		drawStartEnd();
}

function drawMaze2() {
	var i, a;
	clearMaze();

	if (visited) {
		brush.beginPath();
		for (i = 0; i < maze.length; i++)
			for (a = 0; a < maze[i].length; a++)
				if (correctPath[i][a])
					rect(i, a);
		brush.fillStyle = "yellow";
		brush.fill();
		brush.closePath();
	}

	if (showStartEnd)
		drawStartEnd2();

	brush.beginPath();
	for (i = 1; i < maze.length; i+=2)
		for (a = 0; a < maze[i].length; a++)
			if (maze[i][a] == 1) {
				brush.moveTo(i * blockWidth - blockWidth, a * blockWidth);
				brush.lineTo(i * blockWidth + blockWidth, a * blockWidth);
			}

	for (i = 0; i < maze.length; i++)
		for (a = 1; a < maze[i].length; a+=2)
			if (maze[i][a] == 1) {
				brush.moveTo(i * blockWidth, a * blockWidth - blockWidth);
				brush.lineTo(i * blockWidth, a * blockWidth + blockWidth);
			}
	brush.strokeStyle = "black";
	brush.stroke();
	brush.closePath();
}

function drawStartEnd() {
	brush.beginPath();
	rect(startMaze[0], startMaze[1]);
	brush.fillStyle = "green";
	brush.fill();
	brush.closePath();

	brush.beginPath();
	rect(endMaze[0], endMaze[1]);
	brush.fillStyle = "red";
	brush.fill();
	brush.closePath();
}

function drawStartEnd2() {
	brush.beginPath();
	brush.rect(startMaze[0] * blockWidth - blockWidth / 2, startMaze[1] * blockWidth - blockWidth / 2, blockWidth, blockWidth);
	brush.fillStyle = "green";
	brush.fill();
	brush.closePath();

	brush.beginPath();
	brush.rect(endMaze[0] * blockWidth - blockWidth / 2, endMaze[1] * blockWidth - blockWidth / 2, blockWidth, blockWidth);
	brush.fillStyle = "red";
	brush.fill();
	brush.closePath();
}

var animationX, animationY, anOn;

function startAnimation() {
	for (var i = 0; i < maze.length; i++)
		for (var a = 0; a < maze[i].length; a++)
			maze[i][a] = 1;
	animationX = startx;
	animationY = starty;
	anOn = 0;
	maze[animationX][animationY] = 2;
	drawMaze();
	animationInterval = setInterval(function() {
		if (animation[anOn] === undefined) {
			stopAnimation();
			drawMaze();
		}
		else {
			brush.beginPath();
			switch (animation[anOn]) {
				case 0:
					if (maze[animationX][animationY-2] == 1) {
						rect(animationX, animationY-1);
						rect(animationX, animationY-2);
						brush.fillStyle = "blue";
						brush.fill();
						maze[animationX][animationY-1] = 2;
						maze[animationX][animationY-2] = 2;
					}
					else {
						if (animation[anOn - 1] == 1) {
							maze[animationX][animationY] = 0;
							rect(animationX, animationY);
						}
						maze[animationX][animationY-1] = 0;
						rect(animationX, animationY-1);
						if (adjacent2(animationX, animationY-2, 1) === 0) {
							maze[animationX][animationY-2] = 0;
							rect(animationX, animationY-2);
						}
						brush.fillStyle = "white";
						brush.fill();
					}
					animationY -= 2;
					break;
				case 1:
					if (maze[animationX][animationY+2] == 1) {
						rect(animationX, animationY+1);
						rect(animationX, animationY+2);
						brush.fillStyle = "blue";
						brush.fill();
						maze[animationX][animationY+1] = 2;
						maze[animationX][animationY+2] = 2;
					}
					else {
						if (animation[anOn - 1] === 0) {
							maze[animationX][animationY] = 0;
							rect(animationX, animationY);
						}
						rect(animationX, animationY+1);
						maze[animationX][animationY+1] = 0;
						if (adjacent2(animationX, animationY+2, 1) === 0) {
							rect(animationX, animationY+2);
							maze[animationX][animationY+2] = 0;
						}
						brush.fillStyle = "white";
						brush.fill();
					}
					animationY += 2;
					break;
				case 2:
					if (maze[animationX+2][animationY] == 1) {
						rect(animationX+1, animationY);
						rect(animationX+2, animationY);
						brush.fillStyle = "blue";
						brush.fill();
						maze[animationX+1][animationY] = 2;
						maze[animationX+2][animationY] = 2;
					}
					else {
						if (animation[anOn - 1] == 3) {
							maze[animationX][animationY] = 0;
							rect(animationX, animationY);
						}
						rect(animationX + 1, animationY);
						maze[animationX+1][animationY] = 0;
						if (adjacent2(animationX+2, animationY, 1) === 0) {
							rect(animationX+2, animationY);
							maze[animationX+2][animationY] = 0;
						}
						brush.fillStyle = "white";
						brush.fill();
					}
					animationX += 2;
					break;
				case 3:
					if (maze[animationX-2][animationY] == 1) {
						rect(animationX-1, animationY);
						rect(animationX-2, animationY);
						brush.fillStyle = "blue";
						brush.fill();
						maze[animationX-1][animationY] = 2;
						maze[animationX-2][animationY] = 2;
					}
					else {
						if (animation[anOn - 1] == 2) {
							maze[animationX][animationY] = 0;
							rect(animationX, animationY);
						}
						rect(animationX-1, animationY);
						maze[animationX-1][animationY] = 0;
						if (adjacent2(animationX-2, animationY, 1) === 0) {
							maze[animationX-2][animationY] = 0;
							rect(animationX-2, animationY);
						}
						brush.fillStyle = "white";
						brush.fill();
					}
					animationX -= 2;
					break;
			}
			brush.closePath();
			anOn++;
			if (showStartEnd)
				if (thinMaze)
					drawStartEnd2();
				else drawStartEnd();
	//		 drawMaze();
		}
	}, totalAnimationTime * 900 / animation.length);
}

function stopAnimation() {
	clearInterval(animationInterval);
}

function rect(x, y) {
	if (thinMaze)
		brush.rect((x - 1) * blockWidth + 1, (y - 1) * blockWidth + 1, blockWidth * 2 - 2, blockWidth * 2 - 2);
	else brush.rect(x * blockWidth, y * blockWidth, blockWidth, blockWidth);
}

function generateMaze() {
	stopAnimation();
	maze = new Array(dimensions[0]);
	for (var i = 0; i < maze.length; i++) {
		maze[i] = new Array(dimensions[1]);
		for (var a = 0; a < maze[i].length; a++)
			maze[i][a] = 1;
	}
	visited = deadVisited = false;
	if (animate)
		animation = new Array(dimensions[0] * dimensions[1] / 2 | 0);
	animationOn = 0;
	startx = Math.random() * (dimensions[0] - 1) / 2 | 0 * 2 + 1;
	starty = Math.random() * (dimensions[1] - 1) / 2 | 0 * 2 + 1;
	maze[startx][starty] = 0;
	if (mazeStyle == "square" || mazeStyle == "awkward circle square")
		endMaze = [dimensions[0] / 2 - 0.5, dimensions[1] / 2 - 0.5];
	else endMaze = [dimensions[0] - 2, dimensions[1] - 2];
	startMaze = [1, 1];
	if (animate) {
		generateAnimationRecursive(startx, starty);
		startAnimation();
	}
	else {
		generateMazeRecursive(startx, starty);
		drawMaze();
	}
}

function generateMazeRecursive(x, y)	{
	var tempRandDs = getRandDs(x, y);
	for (var i = 0; i < tempRandDs.length; i++)
		switch (tempRandDs[i])	{
			case 0:
				if (y - 2 > 0 && maze[x][y-2] == 1)	{
					maze[x][y-1] = 0;
					maze[x][y-2] = 0;
					generateMazeRecursive(x, y-2);
				}
				break;
			case 1:
				if (y + 2 < maze[0].length && maze[x][y+2] == 1)	{
					maze[x][y+1] = 0;
					maze[x][y+2] = 0;
					generateMazeRecursive(x, y+2);
				}
				break;
			case 2:
				if (x + 2 < maze.length && maze[x+2][y] == 1)	{
					maze[x+1][y] = 0;
					maze[x+2][y] = 0;
					generateMazeRecursive(x+2, y);
				}
				break;
			case 3:
				if (x - 2 > 0 && maze[x-2][y] == 1)	{
					maze[x-1][y] = 0;
					maze[x-2][y] = 0;
					generateMazeRecursive(x-2, y);
				}
				break;
		}
}

function generateAnimationRecursive(x, y) {
	var tempRandDs = getRandDs(x, y);
	for (var i = 0; i < tempRandDs.length; i++)
		switch (tempRandDs[i])	{
			case 0:
				if (y - 2 > 0 && maze[x][y-2] == 1)	{
					maze[x][y-1] = 0;
					maze[x][y-2] = 0;
					animation[animationOn++] = 0;
					generateAnimationRecursive(x, y-2);
					animation[animationOn++] = 1;
				}
				break;
			case 1:
				if (y + 2 < maze[0].length && maze[x][y+2] == 1)	{
					maze[x][y+1] = 0;
					maze[x][y+2] = 0;
					animation[animationOn++] = 1;
					generateAnimationRecursive(x, y+2);
					animation[animationOn++] = 0;
				}
				break;
			case 2:
				if (x + 2 < maze.length && maze[x+2][y] == 1)	{
					maze[x+1][y] = 0;
					maze[x+2][y] = 0;
					animation[animationOn++] = 2;
					generateAnimationRecursive(x+2, y);
					animation[animationOn++] = 3;
				}
				break;
			case 3:
				if (x - 2 > 0 && maze[x-2][y] == 1)	{
					maze[x-1][y] = 0;
					maze[x-2][y] = 0;
					animation[animationOn++] = 3;
					generateAnimationRecursive(x-2, y);
					animation[animationOn++] = 2;
				}
				break;
		}
}

function adjacent(x, y, val) {
	var c = 0;
	if (x > 0 && maze[x-1][y] == val)
		c++;
	if (y > 0 && maze[x][y-1] == val)
		c++;
	if (x < maze.length - 1 && maze[x+1][y] == val)
		c++;
	if (y < maze[x].length - 1 && maze[x][y+1] == val)
		c++;
	return c;
}

function adjacent2(x, y, val) {
	var c = 0;
	if (x > 1 && maze[x-2][y] == val)
		c++;
	if (y > 1 && maze[x][y-2] == val)
		c++;
	if (x < maze.length - 2 && maze[x+2][y] == val)
		c++;
	if (y < maze[x].length - 2 && maze[x][y+2] == val)
		c++;
	return c;
}

function getRandDs(x, y) {
	var ds = [-1, -1, -1, -1];
	var ran;
	var relx = x * maze[0].length / maze.length;
	var rely = y * maze.length / maze[0].length;
	for (var i = 0; i < 3; i++) {
		do {
			switch (mazeStyle) {
				case "normal":
					ran = Math.random() * 4 | 0;
					break;
				case "vertical":
					if (Math.random() * 10 < styleIntensity)
						ran = Math.random() * 2 | 0;
					else ran = Math.random() * 4 | 0;
					break;
				case "horizontal":
					if (Math.random() * 10 < styleIntensity)
						ran = Math.random() * 2 | 0 + 2;
					else ran = Math.random() * 4 | 0;
					break;
				case "checkerboard":
					if (((x / dimensions[0] * 5 | 0) % 2 === 0) == ((y / dimensions[1] * 5 | 0) % 2 === 0))
						if (Math.random() * 10 < styleIntensity)
							ran = Math.random() * 2 | 0;
						else ran = Math.random() * 4 | 0;
					else if (Math.random() * 10 < styleIntensity)
						ran = Math.random() * 2 | 0 + 2;
					else ran = Math.random() * 4 | 0;
					break;
				case "inward x":
					if (relx < y === x > maze.length - rely)
						if (Math.random() * 10 < styleIntensity)
							ran = Math.random() * 2 | 0;
						else ran = Math.random() * 4 | 0;
					else if (Math.random() * 10 < styleIntensity)
						ran = Math.random() * 2 | 0 + 2;
					else ran = Math.random() * 4 | 0;
					break;
				case "square":
					if (relx < y !== x > maze.length - rely)
						if (Math.random() * 10 < styleIntensity)
							ran = Math.random() * 2 | 0;
						else ran = Math.random() * 4 | 0;
					else if (Math.random() * 10 < styleIntensity)
						ran = Math.random() * 2 | 0 + 2;
					else ran = Math.random() * 4 | 0;
					break;
				// TODO: Make circles into ovals on uneven x y
				case "awkward circle":
					if (awkwardCircleVertical(x, y))
						if (Math.random() * 10 < styleIntensity)
							ran = Math.random() * 2 | 0;
						else ran = Math.random() * 4 | 0;
					else if (Math.random() * 10 < styleIntensity)
						ran = Math.random() * 2 | 0 + 2;
					else ran = Math.random() * 4 | 0;
					break;
				case "awkward circle square":
					if (!awkwardCircleVertical(x, y))
						if (Math.random() * 10 < styleIntensity)
							ran = Math.random() * 2 | 0;
						else ran = Math.random() * 4 | 0;
					else if (Math.random() * 10 < styleIntensity)
						ran = Math.random() * 2 | 0 + 2;
					else ran = Math.random() * 4 | 0;
					break;
			}
		} while (ds[ran] != -1);
		ds[ran] = i;
	}
	for (var a = 0; a < 4; a++)
		if (ds[a] == -1) {
			ds[a] = 3;
			break;
		}
	return ds;
}

function awkwardCircleVertical(x, y) {
	var deltaX = Math.abs(x - maze.length / 2);
	var deltaY = Math.abs(y - maze[x].length / 2);
	var relx = x * maze[y].length / maze.length;
	var rely = y * maze.length / maze[y].length;
	if (Math.pow(deltaX, 2) / Math.pow(dimensions[0] / 2 - 0.5, 2) + Math.pow(deltaY, 2) / Math.pow(dimensions[1] / 2 - 0.5, 2) <= 1)
		return relx < y === x > maze.length - rely;
	return relx < y !== x > maze.length - rely;
}

function solveMaze() {
	var already = visited;
	visited = new Array(maze.length);
	correctPath = new Array(maze.length);
	for (var i = 0; i < maze.length; i++) {
		visited[i] = new Array(maze[i].length);
		correctPath[i] = new Array(maze[i].length);
		for (var a = 0; a < maze[i].length; a++) {
			visited[i][a] = false;
			correctPath[i][a] = false;
		}
	}
	if (!already)
		solveMazeRecursive(startMaze[0], startMaze[1]);
	else visited = false;
	drawMaze();
}

function solveMazeRecursive(row, col)	{
	if (row == endMaze[0] && col == endMaze[1]) {
		correctPath[row][col] = true;
		return true;
	}
	visited[row][col] = true;
	if (maze[row-1][col] === 0 && !visited[row-1][col])
		if (solveMazeRecursive(row - 1, col)) {
			correctPath[row][col] = true;
			return true;
		}
	if (maze[row+1][col] === 0 && !visited[row+1][col])
		if (solveMazeRecursive(row + 1, col)) {
			correctPath[row][col] = true;
			return true;
		}
	if (maze[row][col-1] === 0 && !visited[row][col-1])
		if (solveMazeRecursive(row, col - 1)) {
			correctPath[row][col] = true;
			return	true;
		}
	if (maze[row][col+1] === 0 && !visited[row][col+1])
		if (solveMazeRecursive(row, col + 1)) {
			correctPath[row][col] = true;
			return true;
		}
	return false;
}

function removeDeadEnds(threshold) {
	deadVisited = new Array(maze.length);
	for (var i = 0; i < maze.length; i++) {
		deadVisited[i] = new Array(maze[i].length);
		for (var a = 0; a < maze[i].length; a++)
			deadVisited[i][a] = false;
	}
	removeDeadEndsRecursive(startMaze[0], startMaze[1], threshold);
	drawMaze();
}

function removeDeadEndsRecursive(row, col, chance)	{
	deadVisited[row][col] = true;
	if (adjacent(row, col, 1) === 3) {
		if (Math.random() < chance)
			switch (Math.random() * 4 | 0) {
				case 0:
					if (maze[row-1][col] === 1 && row !== 1) {
						maze[row-1][col] = 0;
						break;
					}
				case 1:
					if (maze[row+1][col] === 1 && row !== maze.length - 2) {
						maze[row+1][col] = 0;
						break;
					}
				case 2:
					if (maze[row][col-1] === 1 && col !== 1) {
						maze[row][col-1] = 0;
						break;
					}
				case 3:
					if (maze[row][col+1] === 1 && col !== maze[row].length - 2) {
						maze[row][col+1] = 0;
						break;
					}
				default:
					if (maze[row-1][col] === 1 && row !== 1)
						maze[row-1][col] = 0;
					else if (maze[row+1][col] === 1 && row !== maze.length - 2)
						maze[row+1][col] = 0;
					else if (maze[row][col-1] === 1 && col !== 1)
						maze[row][col-1] = 0;
					else console.error("BOZO ALERT");

			}
	}
	if (maze[row-1][col] === 0 && !deadVisited[row-1][col])
		removeDeadEndsRecursive(row - 1, col, chance);
	if (maze[row+1][col] === 0 && !deadVisited[row+1][col])
		removeDeadEndsRecursive(row + 1, col, chance);
	if (maze[row][col-1] === 0 && !deadVisited[row][col-1])
		removeDeadEndsRecursive(row, col - 1, chance);
	if (maze[row][col+1] === 0 && !deadVisited[row][col+1])
		removeDeadEndsRecursive(row, col + 1, chance);
}

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function showNewGameMenu() {
	$('#new-game-menu').animate({opacity: 0.9}, "slow").css('z-index', 100);
}

$('#new-game').click(showNewGameMenu);
$('#solve-maze').click(solveMaze);

var dontSubmit;

$('#form-new-game').submit(function() {
	if (dontSubmit) {
		dontSubmit = false;
		return false;
	}

	dimensions[0] = parseInt($('input[name="width"]').val());
	dimensions[1] = parseInt($('input[name="height"]').val());

	mazeStyle = $('select[name="maze-style"]').val();
	styleIntensity = parseFloat($('input[name="style-intensity"]').val());

	showStartEnd = $('input[name="show-start"]').prop('checked');
	thinMaze = $('input[name="thin-maze"]').prop('checked');

	animate = $('input[name="animate"]').prop('checked');
	totalAnimationTime = parseFloat($('input[name="duration"]').val());

	customResolution = $('input[name="custom-resolution"]').prop('checked');
	blockWidth = parseInt($('input[name="block-width"]').val());

	$('#new-game-menu').animate({opacity: 0}, "slow", function() {
		$(this).css('z-index', -1);
		resizeMaze();
		generateMaze();
	});

	return false;
});

$('#btn-new-game-cancel').click(function() {
	dontSubmit = true;
	$('#new-game-menu').animate({opacity: 0}, "slow", function() {
		$(this).css('z-index', -1);
	});
});