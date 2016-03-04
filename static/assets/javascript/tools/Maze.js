var docwidth, docheight;
var mazewidth, mazeheight;
var dimensions = new Array(2);
var block_width = 8;
var maze;
var startx, starty;
var maze_style = "normal";
var style_intensity = 8;
var start_maze = new Array(2);
var end_maze = new Array(2);
var animate = false;
var animation, animation_on, animation_interval;
var total_animation_time = 30;
var custom_resolution = false;
var show_start_end = true;
var thin_maze = false;
var visited, correct_path;
var dead_visited;

var mazeui = document.getElementById("maze");
var brush = mazeui.getContext("2d");

function page_ready() {
  $("#maze-tr-div").css('top', $("#content-wrapper").position().top);
  docwidth = $("#content-wrapper").outerWidth(true);
  docheight = $("#content-wrapper").outerHeight(true);
  mazewidth = mazeheight = docwidth < docheight ? docwidth:docheight;
  dimensions[0] = 23;
  dimensions[1] = 23;

  resize_maze();
  generateMaze();
};

function resize_maze() {
  var rec_block_width;
  rec_block_width = docwidth / dimensions[0] < docheight / dimensions[1] ? (docwidth / dimensions[0]):(docheight / dimensions[1]);
  if (!custom_resolution)
    block_width = (docwidth / dimensions[0] < docheight / dimensions[1] ? (docwidth / dimensions[0] | 0):(docheight / dimensions[1] | 0));
  mazewidth = block_width * dimensions[0];
  mazeheight = block_width * dimensions[1];
  var recwidth = rec_block_width * dimensions[0];
  var recheight = rec_block_width * dimensions[1];

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
  resize_maze();
  draw_maze();
});


function clearMaze() {
  brush.clearRect(0, 0, mazewidth, mazeheight);
  brush.beginPath();
  brush.rect(0, 0, mazewidth, mazeheight);
  brush.fillStyle = "white";
  brush.fill();
  brush.closePath();
}

function draw_maze() {
  if (thin_maze) {
    draw_maze2();
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
        if (correct_path[i][a])
          rect(i, a);
    brush.fillStyle = "yellow";
    brush.fill();
    brush.closePath();
  }

  if (show_start_end)
    draw_start_end();
}

function draw_maze2() {
  var i, a;
  clearMaze();

  if (visited) {
    brush.beginPath();
    for (i = 0; i < maze.length; i++)
      for (a = 0; a < maze[i].length; a++)
        if (correct_path[i][a])
          rect(i, a);
    brush.fillStyle = "yellow";
    brush.fill();
    brush.closePath();
  }

  if (show_start_end)
    draw_start_end2();

  brush.beginPath();
  for (i = 1; i < maze.length; i+=2)
    for (a = 0; a < maze[i].length; a++)
      if (maze[i][a] == 1) {
        brush.moveTo(i * block_width - block_width, a * block_width);
        brush.lineTo(i * block_width + block_width, a * block_width);
      }

  for (i = 0; i < maze.length; i++)
    for (a = 1; a < maze[i].length; a+=2)
      if (maze[i][a] == 1) {
        brush.moveTo(i * block_width, a * block_width - block_width);
        brush.lineTo(i * block_width, a * block_width + block_width);
      }
  brush.strokeStyle = "black";
  brush.stroke();
  brush.closePath();
}

function draw_start_end() {
  brush.beginPath();
  rect(start_maze[0], start_maze[1]);
  brush.fillStyle = "green";
  brush.fill();
  brush.closePath();

  brush.beginPath();
  rect(end_maze[0], end_maze[1]);
  brush.fillStyle = "red";
  brush.fill();
  brush.closePath();
}

function draw_start_end2() {
  brush.beginPath();
  brush.rect(start_maze[0] * block_width - block_width / 2, start_maze[1] * block_width - block_width / 2, block_width, block_width);
  brush.fillStyle = "green";
  brush.fill();
  brush.closePath();

  brush.beginPath();
  brush.rect(end_maze[0] * block_width - block_width / 2, end_maze[1] * block_width - block_width / 2, block_width, block_width);
  brush.fillStyle = "red";
  brush.fill();
  brush.closePath();
}

var animation_x, animation_y, an_on;

function start_animation() {
  for (var i = 0; i < maze.length; i++)
    for (var a = 0; a < maze[i].length; a++)
      maze[i][a] = 1;
  animation_x = startx;
  animation_y = starty;
  an_on = 0;
  maze[animation_x][animation_y] = 2;
  draw_maze();
  animation_interval = setInterval(function() {
    if (animation[an_on] === undefined) {
      stop_animation();
      draw_maze();
    }
    else {
      brush.beginPath();
      switch (animation[an_on]) {
        case 0:
          if (maze[animation_x][animation_y-2] == 1) {
            rect(animation_x, animation_y-1);
            rect(animation_x, animation_y-2);
            brush.fillStyle = "blue";
            brush.fill();
            maze[animation_x][animation_y-1] = 2;
            maze[animation_x][animation_y-2] = 2;
          }
          else {
            if (animation[an_on - 1] == 1) {
              maze[animation_x][animation_y] = 0;
              rect(animation_x, animation_y);
            }
            maze[animation_x][animation_y-1] = 0;
            rect(animation_x, animation_y-1);
            if (adjacent2(animation_x, animation_y-2, 1) === 0) {
              maze[animation_x][animation_y-2] = 0;
              rect(animation_x, animation_y-2);
            }
            brush.fillStyle = "white";
            brush.fill();
          }
          animation_y -= 2;
          break;
        case 1:
          if (maze[animation_x][animation_y+2] == 1) {
            rect(animation_x, animation_y+1);
            rect(animation_x, animation_y+2);
            brush.fillStyle = "blue";
            brush.fill();
            maze[animation_x][animation_y+1] = 2;
            maze[animation_x][animation_y+2] = 2;
          }
          else {
            if (animation[an_on - 1] === 0) {
              maze[animation_x][animation_y] = 0;
              rect(animation_x, animation_y);
            }
            rect(animation_x, animation_y+1);
            maze[animation_x][animation_y+1] = 0;
            if (adjacent2(animation_x, animation_y+2, 1) === 0) {
              rect(animation_x, animation_y+2);
              maze[animation_x][animation_y+2] = 0;
            }
            brush.fillStyle = "white";
            brush.fill();
          }
          animation_y += 2;
          break;
        case 2:
          if (maze[animation_x+2][animation_y] == 1) {
            rect(animation_x+1, animation_y);
            rect(animation_x+2, animation_y);
            brush.fillStyle = "blue";
            brush.fill();
            maze[animation_x+1][animation_y] = 2;
            maze[animation_x+2][animation_y] = 2;
          }
          else {
            if (animation[an_on - 1] == 3) {
              maze[animation_x][animation_y] = 0;
              rect(animation_x, animation_y);
            }
            rect(animation_x + 1, animation_y);
            maze[animation_x+1][animation_y] = 0;
            if (adjacent2(animation_x+2, animation_y, 1) === 0) {
              rect(animation_x+2, animation_y);
              maze[animation_x+2][animation_y] = 0;
            }
            brush.fillStyle = "white";
            brush.fill();
          }
          animation_x += 2;
          break;
        case 3:
          if (maze[animation_x-2][animation_y] == 1) {
            rect(animation_x-1, animation_y);
            rect(animation_x-2, animation_y);
            brush.fillStyle = "blue";
            brush.fill();
            maze[animation_x-1][animation_y] = 2;
            maze[animation_x-2][animation_y] = 2;
          }
          else {
            if (animation[an_on - 1] == 2) {
              maze[animation_x][animation_y] = 0;
              rect(animation_x, animation_y);
            }
            rect(animation_x-1, animation_y);
            maze[animation_x-1][animation_y] = 0;
            if (adjacent2(animation_x-2, animation_y, 1) === 0) {
              maze[animation_x-2][animation_y] = 0;
              rect(animation_x-2, animation_y);
            }
            brush.fillStyle = "white";
            brush.fill();
          }
          animation_x -= 2;
          break;
      }
      brush.closePath();
      an_on++;
      if (show_start_end)
        if (thin_maze)
          draw_start_end2();
        else draw_start_end();
  //     draw_maze();
    }
  }, total_animation_time * 900 / animation.length);
}

function stop_animation() {
  clearInterval(animation_interval);
}

function rect(x, y) {
  if (thin_maze)
    brush.rect((x - 1) * block_width + 1, (y - 1) * block_width + 1, block_width * 2 - 2, block_width * 2 - 2);
  else brush.rect(x * block_width, y * block_width, block_width, block_width);
}

function generateMaze() {
  stop_animation();
  maze = new Array(dimensions[0]);
  for (var i = 0; i < maze.length; i++) {
    maze[i] = new Array(dimensions[1]);
    for (var a = 0; a < maze[i].length; a++)
      maze[i][a] = 1;
  }
  visited = dead_visited = false;
  if (animate)
    animation = new Array(dimensions[0] * dimensions[1] / 2 | 0);
  animation_on = 0;
  startx = Math.random() * (dimensions[0] - 1) / 2 | 0 * 2 + 1;
  starty = Math.random() * (dimensions[1] - 1) / 2 | 0 * 2 + 1;
  maze[startx][starty] = 0;
  if (maze_style == "square" || maze_style == "awkward circle square")
    end_maze = [dimensions[0] / 2 - 0.5, dimensions[1] / 2 - 0.5];
  else end_maze = [dimensions[0] - 2, dimensions[1] - 2];
  start_maze = [1, 1];
  if (animate) {
    generateAnimationRecursive(startx, starty);
    start_animation();
  }
  else {
    generateMazeRecursive(startx, starty);
    draw_maze();
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
          animation[animation_on++] = 0;
          generateAnimationRecursive(x, y-2);
          animation[animation_on++] = 1;
        }
        break;
      case 1:
        if (y + 2 < maze[0].length && maze[x][y+2] == 1)	{
          maze[x][y+1] = 0;
          maze[x][y+2] = 0;
          animation[animation_on++] = 1;
          generateAnimationRecursive(x, y+2);
          animation[animation_on++] = 0;
        }
        break;
      case 2:
        if (x + 2 < maze.length && maze[x+2][y] == 1)	{
          maze[x+1][y] = 0;
          maze[x+2][y] = 0;
          animation[animation_on++] = 2;
          generateAnimationRecursive(x+2, y);
          animation[animation_on++] = 3;
        }
        break;
      case 3:
        if (x - 2 > 0 && maze[x-2][y] == 1)	{
          maze[x-1][y] = 0;
          maze[x-2][y] = 0;
          animation[animation_on++] = 3;
          generateAnimationRecursive(x-2, y);
          animation[animation_on++] = 2;
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
      switch (maze_style) {
        case "normal":
          ran = Math.random() * 4 | 0;
          break;
        case "vertical":
          if (Math.random() * 10 < style_intensity)
            ran = Math.random() * 2 | 0;
          else ran = Math.random() * 4 | 0;
          break;
        case "horizontal":
          if (Math.random() * 10 < style_intensity)
            ran = Math.random() * 2 | 0 + 2;
          else ran = Math.random() * 4 | 0;
          break;
        case "checkerboard":
          if (((x / dimensions[0] * 5 | 0) % 2 === 0) == ((y / dimensions[1] * 5 | 0) % 2 === 0))
            if (Math.random() * 10 < style_intensity)
              ran = Math.random() * 2 | 0;
            else ran = Math.random() * 4 | 0;
          else if (Math.random() * 10 < style_intensity)
            ran = Math.random() * 2 | 0 + 2;
          else ran = Math.random() * 4 | 0;
          break;
        case "inward x":
          if (relx < y === x > maze.length - rely)
            if (Math.random() * 10 < style_intensity)
              ran = Math.random() * 2 | 0;
            else ran = Math.random() * 4 | 0;
          else if (Math.random() * 10 < style_intensity)
            ran = Math.random() * 2 | 0 + 2;
          else ran = Math.random() * 4 | 0;
          break;
        case "square":
          if (relx < y !== x > maze.length - rely)
            if (Math.random() * 10 < style_intensity)
              ran = Math.random() * 2 | 0;
            else ran = Math.random() * 4 | 0;
          else if (Math.random() * 10 < style_intensity)
            ran = Math.random() * 2 | 0 + 2;
          else ran = Math.random() * 4 | 0;
          break;
        // TODO: Make circles into ovals on uneven x y
        case "awkward circle":
          if (awkwardCircleVertical(x, y))
            if (Math.random() * 10 < style_intensity)
              ran = Math.random() * 2 | 0;
            else ran = Math.random() * 4 | 0;
          else if (Math.random() * 10 < style_intensity)
            ran = Math.random() * 2 | 0 + 2;
          else ran = Math.random() * 4 | 0;
          break;
        case "awkward circle square":
          if (!awkwardCircleVertical(x, y))
            if (Math.random() * 10 < style_intensity)
              ran = Math.random() * 2 | 0;
            else ran = Math.random() * 4 | 0;
          else if (Math.random() * 10 < style_intensity)
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

function solve_maze() {
  var already = visited;
  visited = new Array(maze.length);
  correct_path = new Array(maze.length);
  for (var i = 0; i < maze.length; i++) {
    visited[i] = new Array(maze[i].length);
    correct_path[i] = new Array(maze[i].length);
    for (var a = 0; a < maze[i].length; a++) {
      visited[i][a] = false;
      correct_path[i][a] = false;
    }
  }
  if (!already)
    solveMazeRecursive(start_maze[0], start_maze[1]);
  else visited = false;
  draw_maze();
}

function solveMazeRecursive(row, col)	{
  if (row == end_maze[0] && col == end_maze[1]) {
    correct_path[row][col] = true;
    return true;
  }
  visited[row][col] = true;
  if (maze[row-1][col] === 0 && !visited[row-1][col])
    if (solveMazeRecursive(row - 1, col)) {
      correct_path[row][col] = true;
      return true;
    }
  if (maze[row+1][col] === 0 && !visited[row+1][col])
    if (solveMazeRecursive(row + 1, col)) {
      correct_path[row][col] = true;
      return true;
    }
  if (maze[row][col-1] === 0 && !visited[row][col-1])
    if (solveMazeRecursive(row, col - 1)) {
      correct_path[row][col] = true;
      return  true;
    }
  if (maze[row][col+1] === 0 && !visited[row][col+1])
    if (solveMazeRecursive(row, col + 1)) {
      correct_path[row][col] = true;
      return true;
    }
  return false;
}

function remove_dead_ends(threshold) {
  dead_visited = new Array(maze.length);
  for (var i = 0; i < maze.length; i++) {
    dead_visited[i] = new Array(maze[i].length);
    for (var a = 0; a < maze[i].length; a++)
      dead_visited[i][a] = false;
  }
  remove_dead_ends_recursive(start_maze[0], start_maze[1], threshold);
  draw_maze();
}

function remove_dead_ends_recursive(row, col, chance)	{
  dead_visited[row][col] = true;
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
  if (maze[row-1][col] === 0 && !dead_visited[row-1][col])
    remove_dead_ends_recursive(row - 1, col, chance);
  if (maze[row+1][col] === 0 && !dead_visited[row+1][col])
    remove_dead_ends_recursive(row + 1, col, chance);
  if (maze[row][col-1] === 0 && !dead_visited[row][col-1])
    remove_dead_ends_recursive(row, col - 1, chance);
  if (maze[row][col+1] === 0 && !dead_visited[row][col+1])
    remove_dead_ends_recursive(row, col + 1, chance);
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

function show_new_game_menu() {
  $('#new-game-menu').animate({opacity: 0.9}, "slow").css('z-index', 100);
}

$('#new-game').click(show_new_game_menu);
$('#solve-maze').click(solve_maze);

var dont_submit;

$('#form-new-game').submit(function() {
  if (dont_submit) {
    dont_submit = false;
    return false;
  }

  dimensions[0] = parseInt($('input[name="width"]').val());
  dimensions[1] = parseInt($('input[name="height"]').val());

  maze_style = $('select[name="maze-style"]').val();
  style_intensity = parseFloat($('input[name="style-intensity"]').val());

  show_start_end = $('input[name="show-start"]').prop('checked');
  thin_maze = $('input[name="thin-maze"]').prop('checked');

  animate = $('input[name="animate"]').prop('checked');
  total_animation_time = parseFloat($('input[name="duration"]').val());

  custom_resolution = $('input[name="custom-resolution"]').prop('checked');
  block_width = parseInt($('input[name="block-width"]').val());

  $('#new-game-menu').animate({opacity: 0}, "slow", function() {
    $(this).css('z-index', -1);
    resize_maze();
    generateMaze();
  });

  return false;
});

$('#btn-new-game-cancel').click(function() {
  dont_submit = true;
  $('#new-game-menu').animate({opacity: 0}, "slow", function() {
    $(this).css('z-index', -1);
  });
});