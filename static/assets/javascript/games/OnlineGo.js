var docwidth, docheight, gowidth;
var size;
var board, boards, captures;
var blackturn, boardon;
var wcaptures, bcaptures;
var second, seconds;
var i, a;
var ss; // square size
var max_turn;
var black_pass;
var game_type = "Go";
var last_piece, last_pieces;
var timer;
var gomoku_ai = false;
var ai_color;
var ai_depth = 2;
var influence_alright = false;
var ai_move_check = 10;
var expansion_const = 2;
var global_ROOT;
var anti = false;
var board_top, board_left;

var goban = document.getElementById("board");
var brush = goban.getContext("2d");

String.prototype.toMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var minutes = Math.floor(sec_num / 60);
    var seconds = sec_num - (minutes * 60);

    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = minutes+':'+seconds;
    return time;
};

function update_second_display() {
  $('#black-cntdwn').text(("" + second[0]).toMMSS());
  $('#white-cntdwn').text(("" + second[1]).toMMSS());
}

function countdown() {
  second[blackturn ? 0:1]--;
  update_second_display();
  if (second[blackturn ? 0:1] === 0) {
    alert((blackturn ? "White":"Black") + " wins on time!");
    clearInterval(timer);
  }
}

function log_array(arr) {
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

function save_captures(index, b, w)	{
  captures[index] = [b, w];
}

function save_seconds(index, times)	{
  seconds[index] = JSON.parse(JSON.stringify(times));
}

function save_last_piece(index) {
  last_pieces[index] = last_piece;
}

function save_board(index, goban) {
  boards[index] = JSON.parse(JSON.stringify(goban));
  save_captures(index, bcaptures, wcaptures);
  save_seconds(index, second);
  save_last_piece(index);
}

function get_captures(index)	{
  bcaptures = captures[index][0];
  wcaptures = captures[index][1];
  $('#black-stone').text(bcaptures);
  $('#white-stone').text(wcaptures);
}

function get_seconds(index)	{
  second = seconds[index];
}

function get_last_piece(index) {
  last_piece = last_pieces[index];
}

function get_board(index)	{
  get_captures(index);
  get_seconds(index);
  get_last_piece(index);
  return boards[index];
}

function set_turn(bturn) {
  blackturn = bturn;
  var selected_stone = bturn ? $('#black-stone'):$('#white-stone');
  var other_stone = bturn ? $('#white-stone'):$('#black-stone');

  selected_stone.css('box-shadow', 'yellow 0px 0px 50px').css('background-color', '#FFFFA0');
  other_stone.css('box-shadow', 'none').css('background-color', 'rgba(0,0,0,0)');
}

function draw_arc(x, y, radius) {
  brush.arc(x * ss + ss / 2, y * ss + ss / 2, radius, 0, Math.PI * 2);
}

function draw_circle(x, y, opacity) {
  switch(board[x][y]) {
      case 'W': brush.strokeStyle = "rgba(0, 0, 0, " + opacity + ")"; break;
    case 'B': brush.strokeStyle = "rgba(255, 255, 255, " + opacity + ")"; break;
    default: return;
  }
  brush.beginPath();
  brush.lineWidth = ss / 10;
  draw_arc(x, y, ss * 0.22);
  brush.stroke();
}

function draw_piece(x, y, char, opacity) {
  switch (char)	{
    case 'B': brush.fillStyle = "rgba(0, 0, 0, " + opacity + ")"; break;
    case 'W': brush.fillStyle = "rgba(255, 255, 255, " + opacity + ")"; break;
    default: return;
  }
  brush.beginPath();
  brush.lineWidth = ss / 25;
  draw_arc(x, y, ss * 0.4);
  brush.fill();
  brush.strokeStyle = "rgba(0, 0, 0, " + opacity + ")";
  brush.stroke();
}

function draw_key_points() {
  var quarter = Math.floor(Math.sqrt(size)) - 1;
  var half = (size - 1) / 2;
  brush.fillStyle = "black";
  brush.beginPath(); draw_arc(half, half, ss * 0.17); brush.fill();
  brush.beginPath(); draw_arc(quarter, quarter, ss * 0.17); brush.fill();
  brush.beginPath(); draw_arc(half, quarter, ss * 0.17); brush.fill();
  brush.beginPath(); draw_arc(quarter, half, ss * 0.17); brush.fill();
  brush.beginPath(); draw_arc(size-quarter-1, size-quarter-1, ss * 0.17); brush.fill();
  brush.beginPath(); draw_arc(size-quarter-1, quarter, ss * 0.17); brush.fill();
  brush.beginPath(); draw_arc(quarter, size-quarter-1, ss * 0.17); brush.fill();
  brush.beginPath(); draw_arc(size-quarter-1, half, ss * 0.17); brush.fill();
  brush.beginPath(); draw_arc(half, size-quarter-1, ss * 0.17); brush.fill();
}

function clear_canvas() {
  brush.clearRect(0, 0, gowidth, gowidth);
}

function draw_board(x, y, char) {
  clear_canvas();

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

  draw_key_points();

  for (i = 0; i < board.length; i++)
    for (a = 0; a < board[i].length; a++)
      draw_piece(i, a, board[i][a], 1);

  if (char)
    draw_piece(x, y, char, 0.5);

  if (last_piece)
    draw_circle(last_piece[0], last_piece[1], 1);

  update_second_display();
}

function identical_boards(board1, board2) {
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

function MCTS_check_gomoku_win(tboard, x, y) {
  var countConsecutive = 0;
  var color = 'null';
  for (i = x - 4; i <= x + 4; i++) // Horizontal
    if (i >= 0 && i < tboard.length && countConsecutive < 5)
      if (tboard[i][y] == color)
        countConsecutive++;
      else if (tboard[i][y] == 'B' || tboard[i][y] == 'W') {
        color = tboard[i][y];
        countConsecutive = 1;
      }
      else	color = 'null';
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
      }
      else	color = 'null';
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
      }
      else	color = 'null';
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
      }
      else	color = 'null';
    else if (countConsecutive == 5)
      return true;
  if (countConsecutive == 5)
    return true;
}

function check_gomoku_win(x, y) {
  var countConsecutive = 0;
  var color = 'null';
  for (i = x - 4; i <= x + 4; i++) // Horizontal
    if (i >= 0 && i < board.length && countConsecutive < 5)
      if (board[i][y] == color)
        countConsecutive++;
      else if (board[i][y] == 'B' || board[i][y] == 'W') {
        color = board[i][y];
        countConsecutive = 1;
      }
      else	color = 'null';
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
      }
      else	color = 'null';
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
      }
      else	color = 'null';
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
      }
      else	color = 'null';
    else if (countConsecutive == 5)
      return true;
  if (countConsecutive == 5)
    return true;
}

function gomoku_shape_score(consecutive, open_ends, curr_turn) {
  switch (consecutive) {
    case 4:
      switch (open_ends) {
        case 0:
          return 0;
        case 1:
          if (curr_turn)
            return 100000000;
          return 50;
        case 2:
          if (curr_turn)
            return 100000000;
          return 500000;
      }
    case 3:
      switch (open_ends) {
        case 0:
          return 0;
        case 1:
          if (curr_turn)
            return 7;
          return 5;
        case 2:
          if (curr_turn)
            return 10000;
          return 50;
      }
    case 2:
      switch (open_ends) {
        case 0:
          return 0;
        case 1:
          return 2;
        case 2:
          return 5;
      }
    case 1:
      switch (open_ends) {
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

function analyze_gomoku_color(black, bturn, startx, endx, starty, endy) {
  var score = 0;
  var color = black ? 'B':'W';
  var countConsecutive = 0;
  var open_ends = 0;
  var x, y;

  for (i = startx; i < endx; i++) {
    for (a = starty; a < endy; a++) {
      if (board[i][a] == color)
        countConsecutive++;
      else if (board[i][a] == ' ' && countConsecutive > 0) {
        open_ends++;
        score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
        countConsecutive = 0;
        open_ends = 1;
      }
      else if (board[i][a] == ' ')
        open_ends = 1;
      else if (countConsecutive > 0) {
        score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
        countConsecutive = 0;
        open_ends = 0;
      }
      else open_ends = 0;
    }
    if (countConsecutive > 0)
      score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
    countConsecutive = 0;
    open_ends = 0;
  }

  for (a = starty; a < endy; a++) {
    for (i = startx; i < endx; i++) {
      if (board[i][a] == color)
        countConsecutive++;
      else if (board[i][a] == ' ' && countConsecutive > 0) {
        open_ends++;
        score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
        countConsecutive = 0;
        open_ends = 1;
      }
      else if (board[i][a] == ' ')
        open_ends = 1;
      else if (countConsecutive > 0) {
        score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
        countConsecutive = 0;
        open_ends = 0;
      }
      else open_ends = 0;
    }
    if (countConsecutive > 0)
      score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
    countConsecutive = 0;
    open_ends = 0;
  }

  for (x = startx; x < endx; x++) { // diagonal 1
    for (i = x, a = starty; i < endx && a < endy; i++, a++) {
      if (board[i][a] == color)
        countConsecutive++;
      else if (board[i][a] == ' ' && countConsecutive > 0) {
        open_ends++;
        score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
        countConsecutive = 0;
        open_ends = 1;
      }
      else if (board[i][a] == ' ')
        open_ends = 1;
      else if (countConsecutive > 0) {
        score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
        countConsecutive = 0;
        open_ends = 0;
      }
      else open_ends = 0;
    }
    if (countConsecutive > 0)
      score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
    countConsecutive = 0;
    open_ends = 0;
  }

  for (y = starty + 1; y < endy; y++) { // diagonal 1
    for (i = startx, a = y; i < endx && a < endy; i++, a++) {
      if (board[i][a] == color)
        countConsecutive++;
      else if (board[i][a] == ' ' && countConsecutive > 0) {
        open_ends++;
        score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
        countConsecutive = 0;
        open_ends = 1;
      }
      else if (board[i][a] == ' ')
        open_ends = 1;
      else if (countConsecutive > 0) {
        score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
        countConsecutive = 0;
        open_ends = 0;
      }
      else open_ends = 0;
    }
    if (countConsecutive > 0)
      score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
    countConsecutive = 0;
    open_ends = 0;
  }

  for (x = startx; x < endx; x++) { // diagonal 2
    for (i = x, a = starty; i >= startx && a < endy; i--, a++) {
      if (board[i][a] == color)
        countConsecutive++;
      else if (board[i][a] == ' ' && countConsecutive > 0) {
        open_ends++;
        score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
        countConsecutive = 0;
        open_ends = 1;
      }
      else if (board[i][a] == ' ')
        open_ends = 1;
      else if (countConsecutive > 0) {
        score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
        countConsecutive = 0;
        open_ends = 0;
      }
      else open_ends = 0;
    }
    if (countConsecutive > 0)
      score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
    countConsecutive = 0;
    open_ends = 0;
  }

  for (y = starty + 1; y < endy; y++) { // diagonal 2
    for (i = endx - 1, a = y; i >= startx && a < endy; i--, a++) {
      if (board[i][a] == color)
        countConsecutive++;
      else if (board[i][a] == ' ' && countConsecutive > 0) {
        open_ends++;
        score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
        countConsecutive = 0;
        open_ends = 1;
      }
      else if (board[i][a] == ' ')
        open_ends = 1;
      else if (countConsecutive > 0) {
        score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
        countConsecutive = 0;
        open_ends = 0;
      }
      else open_ends = 0;
    }
    if (countConsecutive > 0)
      score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
    countConsecutive = 0;
    open_ends = 0;
  }

  return score;
}

function MCTS_analyze_gomoku_color(tboard, black, bturn, startx, endx, starty, endy) {
  var score = 0;
  var color = black ? 'B':'W';
  var countConsecutive = 0;
  var open_ends = 0;
  var x, y;

  for (i = startx; i < endx; i++) {
    for (a = starty; a < endy; a++) {
      if (tboard[i][a] == color)
        countConsecutive++;
      else if (tboard[i][a] == ' ' && countConsecutive > 0) {
        open_ends++;
        score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
        countConsecutive = 0;
        open_ends = 1;
      }
      else if (tboard[i][a] == ' ')
        open_ends = 1;
      else if (countConsecutive > 0) {
        score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
        countConsecutive = 0;
        open_ends = 0;
      }
      else open_ends = 0;
    }
    if (countConsecutive > 0)
      score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
    countConsecutive = 0;
    open_ends = 0;
  }

  for (a = starty; a < endy; a++) {
    for (i = startx; i < endx; i++) {
      if (tboard[i][a] == color)
        countConsecutive++;
      else if (tboard[i][a] == ' ' && countConsecutive > 0) {
        open_ends++;
        score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
        countConsecutive = 0;
        open_ends = 1;
      }
      else if (tboard[i][a] == ' ')
        open_ends = 1;
      else if (countConsecutive > 0) {
        score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
        countConsecutive = 0;
        open_ends = 0;
      }
      else open_ends = 0;
    }
    if (countConsecutive > 0)
      score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
    countConsecutive = 0;
    open_ends = 0;
  }

  for (x = startx; x < endx; x++) { // diagonal 1
    for (i = x, a = starty; i < endx && a < endy; i++, a++) {
      if (tboard[i][a] == color)
        countConsecutive++;
      else if (tboard[i][a] == ' ' && countConsecutive > 0) {
        open_ends++;
        score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
        countConsecutive = 0;
        open_ends = 1;
      }
      else if (tboard[i][a] == ' ')
        open_ends = 1;
      else if (countConsecutive > 0) {
        score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
        countConsecutive = 0;
        open_ends = 0;
      }
      else open_ends = 0;
    }
    if (countConsecutive > 0)
      score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
    countConsecutive = 0;
    open_ends = 0;
  }

  for (y = starty + 1; y < endy; y++) { // diagonal 1
    for (i = startx, a = y; i < endx && a < endy; i++, a++) {
      if (tboard[i][a] == color)
        countConsecutive++;
      else if (tboard[i][a] == ' ' && countConsecutive > 0) {
        open_ends++;
        score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
        countConsecutive = 0;
        open_ends = 1;
      }
      else if (tboard[i][a] == ' ')
        open_ends = 1;
      else if (countConsecutive > 0) {
        score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
        countConsecutive = 0;
        open_ends = 0;
      }
      else open_ends = 0;
    }
    if (countConsecutive > 0)
      score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
    countConsecutive = 0;
    open_ends = 0;
  }

  for (x = startx; x < endx; x++) { // diagonal 2
    for (i = x, a = starty; i >= startx && a < endy; i--, a++) {
      if (tboard[i][a] == color)
        countConsecutive++;
      else if (tboard[i][a] == ' ' && countConsecutive > 0) {
        open_ends++;
        score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
        countConsecutive = 0;
        open_ends = 1;
      }
      else if (tboard[i][a] == ' ')
        open_ends = 1;
      else if (countConsecutive > 0) {
        score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
        countConsecutive = 0;
        open_ends = 0;
      }
      else open_ends = 0;
    }
    if (countConsecutive > 0)
      score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
    countConsecutive = 0;
    open_ends = 0;
  }

  for (y = starty + 1; y < endy; y++) { // diagonal 2
    for (i = endx - 1, a = y; i >= startx && a < endy; i--, a++) {
      if (tboard[i][a] == color)
        countConsecutive++;
      else if (tboard[i][a] == ' ' && countConsecutive > 0) {
        open_ends++;
        score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
        countConsecutive = 0;
        open_ends = 1;
      }
      else if (tboard[i][a] == ' ')
        open_ends = 1;
      else if (countConsecutive > 0) {
        score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
        countConsecutive = 0;
        open_ends = 0;
      }
      else open_ends = 0;
    }
    if (countConsecutive > 0)
      score += gomoku_shape_score(countConsecutive, open_ends, bturn == black);
    countConsecutive = 0;
    open_ends = 0;
  }

  return score;
}


function analyze_gomoku(bturn) {
  return analyze_gomoku_color(true, bturn, 0, board.length, 0, board[0].length) - analyze_gomoku_color(false, bturn, 0, board.length, 0, board[0].length);
}

function MCTS_analyze_gomoku(tboard, bturn) {
  return MCTS_analyze_gomoku_color(tboard, true, bturn, 0, tboard.length, 0, tboard[0].length) - MCTS_analyze_gomoku_color(tboard, false, bturn, 0, tboard.length, 0, tboard[0].length);
}

function analyze_piece_weight_gomoku(bturn, x, y) {
  board[x][y] = bturn ? 'B':'W';
  var startx = x > 4 ? (x-4):0, starty = y > 4 ? (y-4):0;
  var endx = x < board.length - 5 ? (x+5):(board.length), endy = y < board[x].length - 5 ? (y+5):(board[x].length);
  var analysis = analyze_gomoku_color(bturn, !bturn, startx, endx, starty, endy);
  board[x][y] = ' ';
  return analysis - analyze_gomoku_color(bturn, !bturn, startx, endx, starty, endy);
}

function adjacent(i_temp, a_temp) {
  if (i_temp == (size - 1) / 2 && a_temp == i_temp)
    return true;

  var d = influence_alright ? 2:1;

  for (i = i_temp - d; i <= i_temp + d; i++)
    for (a = a_temp - d; a <= a_temp + d; a++)
      if (i >= 0 && a >= 0 && i < board.length && a < board[i].length)
        if (board[i][a] != ' ')
          return true;

  return false;
}

function MCTS_adjacent(tboard, i_temp, a_temp) {
  if (i_temp == (size - 1) / 2 && a_temp == i_temp)
    return true;

  var d = influence_alright ? 2:1;

  for (i = i_temp - d; i <= i_temp + d; i++)
    for (a = a_temp - d; a <= a_temp + d; a++)
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

// function threat_moves() {


//   for (var i_temp = 0; i_temp < board.length; i_temp++)
//     for (var a_temp = 0; a_temp < board[i_temp].length; a_temp++)
//       if (board[i_temp][a_temp] == ' ' && adjacent(i_temp, a_temp)) {
// }

function sort_moves(bturn) {
  var color = bturn ? 'B':'W';
  var analysis, analysis2;
  var sorted_moves = [];

  if (!anti) {
    var win = winning_move(bturn);
    if (win) {
      board[win[0]][win[1]] = color;
      analysis = analyze_gomoku(!bturn);
      board[win[0]][win[1]] = ' ';
      return [[analysis, win[0], win[1]]];
    }
    else win = winning_move(!bturn);
    if (win) {
      board[win[0]][win[1]] = color;
      analysis = analyze_gomoku(!bturn);
      board[win[0]][win[1]] = ' ';
      return [[analysis, win[0], win[1]]];
    }
  }

  for (var i_temp = 0; i_temp < board.length; i_temp++)
    for (var a_temp = 0; a_temp < board[i_temp].length; a_temp++)
      if (board[i_temp][a_temp] == ' ' && adjacent(i_temp, a_temp)) {
//         board[i_temp][a_temp] = color;
//         analysis = analyze_gomoku(!bturn);
//         if (!bturn)
//           analysis *= -1;
//         board[i_temp][a_temp] = ' ';
//         insert([analysis, i_temp, a_temp], sorted_moves);
        analysis = analyze_piece_weight_gomoku(bturn, i_temp, a_temp);
        analysis2 = analyze_piece_weight_gomoku(!bturn, i_temp, a_temp);
        insert([analysis < analysis2 ? analysis:analysis2, i_temp, a_temp], sorted_moves);
      }

  if (!anti && sorted_moves[sorted_moves.length-1][0] > 50000000)
    return [sorted_moves[sorted_moves.length-1]];
  return sorted_moves;
}

function possible_moves(bturn) {
  var color = bturn ? 'B':'W';
  var analysis, analysis2;
  var sorted_moves = [];

  var win = winning_move(bturn);
  if (win) {
    board[win[0]][win[1]] = color;
    analysis = analyze_gomoku(!bturn);
    board[win[0]][win[1]] = ' ';
    return [[analysis, win[0], win[1]]];
  }
  else win = winning_move(!bturn);
  if (win) {
    board[win[0]][win[1]] = color;
    analysis = analyze_gomoku(!bturn);
    board[win[0]][win[1]] = ' ';
    return [[analysis, win[0], win[1]]];
  }

  for (var i_temp = 0; i_temp < board.length; i_temp++)
    for (var a_temp = 0; a_temp < board[i_temp].length; a_temp++)
      if (board[i_temp][a_temp] == ' ' && adjacent(i_temp, a_temp))
        sorted_moves.push([0, i_temp, a_temp]);
  return sorted_moves;
}

function winning_move(bturn) {
  var color = bturn ? 'B':'W';

  for (var i_temp = 0; i_temp < board.length; i_temp++)
    for (var a_temp = 0; a_temp < board[i_temp].length; a_temp++)
      if (board[i_temp][a_temp] == ' ' && adjacent(i_temp, a_temp)) {
        board[i_temp][a_temp] = color;
        if (check_gomoku_win(i_temp, a_temp)) {
          board[i_temp][a_temp] = ' ';
          return [i_temp, a_temp];
        }
        board[i_temp][a_temp] = ' ';
      }

  return false;
}

function MCTS_winning_move(tboard, bturn) {
  var color = bturn ? 'B':'W';

  for (var i_temp = 0; i_temp < tboard.length; i_temp++)
    for (var a_temp = 0; a_temp < tboard[i_temp].length; a_temp++)
      if (tboard[i_temp][a_temp] == ' ' && MCTS_adjacent(tboard, i_temp, a_temp)) {
        tboard[i_temp][a_temp] = color;
        if (MCTS_check_gomoku_win(tboard, i_temp, a_temp)) {
          tboard[i_temp][a_temp] = ' ';
          return [i_temp, a_temp];
        }
        tboard[i_temp][a_temp] = ' ';
      }
  return false;
}

function best_gomoku_move(bturn, depth) {
  var color = bturn ? 'B':'W';
  var x_best = -1, y_best = -1;
  var best_score = bturn ? -1000000000:1000000000;
  var analysis;
  var black_response;
  var anal_turn = depth % 2 === 0 ? bturn:!bturn;
  var sorted_moves;

//   if (depth == 1)
//     sorted_moves = possible_moves(bturn);
  sorted_moves = sort_moves(bturn);

  for (var i_temp = sorted_moves.length-1; i_temp > sorted_moves.length - ai_move_check - 1 && i_temp >= 0; i_temp--) {
    var tempi = anti ? (sorted_moves.length - 1 - i_temp):i_temp;
    board[sorted_moves[tempi][1]][sorted_moves[tempi][2]] = color;
    if (depth == 1) {
      analysis = analyze_gomoku(anal_turn);
      if (anti)
        analysis *= -1;
    }
    else {
      black_response = best_gomoku_move(!bturn, depth - 1);
      analysis = black_response[2];
    }
    board[sorted_moves[tempi][1]][sorted_moves[tempi][2]] = ' ';
    if ((analysis > best_score && bturn) || (analysis < best_score && !bturn)) {
      best_score = analysis;
      x_best = sorted_moves[tempi][1];
      y_best = sorted_moves[tempi][2];
    }
  }

  return [x_best, y_best, best_score];
}

function create_MCTS_root() {
  return new MCTS_Node(new State($.extend(true, [], board), blackturn), null, null, MCTS_simulate, MCTS_get_children, expansion_const);
}

function MCTS_simulate(State) {
  var temp_board = $.extend(true, [], State.board);
  var bturn = State.turn;

  if (MCTS_check_gomoku_win(temp_board))
    return MCTS_analyze_gomoku(temp_board, bturn);

  return MCTS_simulate_game(temp_board, bturn, bturn);
}

function MCTS_simulate_game(tboard, global_turn, bturn) {
  influence_alright = true;
  var last_move, last_index, possible_moves = MCTS_get_possible_moves(tboard);
  influence_alright = false;
  do {
    last_index = MCTS_get_random_move(tboard, bturn, possible_moves);
    last_move = possible_moves[last_index];
    tboard[last_move[0]][last_move[1]] = bturn ? 'B':'W';
    bturn = !bturn;
    MCTS_deal_with_possible_moves(possible_moves, last_index, last_move);
  } while (!MCTS_check_gomoku_win(tboard, last_move[0], last_move[1]) && possible_moves.length > 0);
  return MCTS_analyze_gomoku(tboard, global_turn);
}

function MCTS_get_random_move(tboard, bturn, possible_moves) {
//   var iwin = false, uwin = false;
//   var i, a;
//   for (i = 0; i < possible_moves.length; i++) {
//     tboard[possible_moves[i][0]][possible_moves[i][1]] = bturn ? 'B':'W';
//     if (MCTS_check_gomoku_win(tboard, possible_moves[i][0], possible_moves[i][1])) {
//       iwin = i;
//       tboard[possible_moves[i][0]][possible_moves[i][1]] = ' ';
//       break;
//     }
//     tboard[possible_moves[i][0]][possible_moves[i][1]] = bturn ? 'W':'B';
//     if (MCTS_check_gomoku_win(tboard, possible_moves[i][0], possible_moves[i][1]))
//       uwin = i;

//     tboard[possible_moves[i][0]][possible_moves[i][1]] = ' ';
//   }
//   if (iwin)
//     return iwin;
//   if (uwin)
//     return uwin;

  return Math.floor(Math.random() * possible_moves.length);
}

function MCTS_get_possible_moves(tboard) {
  var possible_moves = [];
  for (var i = 0; i < tboard.length; i++)
    for (var a = 0; a < tboard[i].length; a++)
      if (tboard[i][a] == ' ')
        possible_moves.push([i, a]);
  return possible_moves;
}

function MCTS_deal_with_possible_moves(possible_moves, last_index, last_move) {
  possible_moves.splice(last_index, 1);
}

function MCTS_get_children(state, father) {
  var temp_board = $.extend(true, [], state.board);
  var bturn = state.turn;
  var i, a;

  if (MCTS_check_gomoku_win(temp_board))
    return [];

  var win = MCTS_winning_move(temp_board, bturn);
  if (win) {
//     console.log(win);
    temp_board[win[0]][win[1]] = state.turn ? 'B':'W';
    return [new MCTS_Node(new State(temp_board, !bturn), father, win, MCTS_simulate, MCTS_get_children, expansion_const)];
  }
  else win = MCTS_winning_move(temp_board, !bturn);
  if (win) {
//     console.log(win);
    temp_board[win[0]][win[1]] = state.turn ? 'B':'W';
    return [new MCTS_Node(new State(temp_board, !bturn), father, win, MCTS_simulate, MCTS_get_children, expansion_const)];
  }
  var possible_children = [];
  for (i = 0; i < temp_board.length; i++)
    for (a = 0; a < temp_board[i].length; a++)
      if (temp_board[i][a] == ' ' && MCTS_adjacent(temp_board, i, a)) {
        temp_board[i][a] = state.turn ? 'B':'W';
        possible_children.push(new MCTS_Node(new State($.extend(true, [], temp_board), !bturn), father, [i, a], MCTS_simulate, MCTS_get_children, expansion_const));
        temp_board[i][a] = ' ';
      }
  for (i = 0; i < possible_children.length - 1; i++)
    for (a = i + 1; a < possible_children.length; a++)
      if (identical_boards(possible_children[i].State.board, possible_children[a].State.board)) {
//         console.log(possible_children);
        possible_children.splice(a, 1);
//         console.log(possible_children);
        a--;
      }
//   console.log("Final", possible_children);
  return possible_children;
}

function MCTS_get_next_root(move) {
  if (!global_ROOT || !global_ROOT.children)
    return null;
  for (var i = 0; i < global_ROOT.children.length; i++)
    if (global_ROOT.children[i].last_move[0] == move[0] && global_ROOT.children[i].last_move[1] == move[1]) {
      global_ROOT.children[i].parent = null;
      return global_ROOT.children[i];
    }
  return null;
}

function run_MCTS(times) {
  if (!global_ROOT)
    global_ROOT = create_MCTS_root();
  for (var i = 0; i < times; i++)
    global_ROOT.choose_child();
  return global_ROOT;
}

function get_best_move_MCTS(simulate) {
  if (!global_ROOT)
    return -1;
  if (simulate && global_ROOT.total_tries < monte_carlo_trials)
    run_MCTS(monte_carlo_trials - global_ROOT.total_tries);
  var best_move, most_trials = 0;
  for (var i = 0; i < global_ROOT.children.length; i++)
    if (global_ROOT.children[i].total_tries > most_trials) {
      most_trials = global_ROOT.children[i].total_tries;
      best_move = global_ROOT.children[i].last_move;
    }
  return best_move;
}

function play_ai_turn_gomoku() {
  var best_move = best_gomoku_move(blackturn, ai_depth);
  var analysis = best_move[2];
  if (best_move[0] < 0)
    best_move = best_gomoku_move(blackturn, 1);
//   console.log("heya");
//   run_MCTS(10000);
//   var best_move = get_best_move_MCTS(false);
//   global_ROOT = MCTS_get_next_root(best_move);
  board[best_move[0]][best_move[1]] = blackturn ? 'B':'W';
  last_piece = [best_move[0], best_move[1]];
  save_board(boardon, board);
  boardon++;
  max_turn = boardon;
  set_turn(!blackturn);
  black_pass = false;
  draw_board();

  $('#gomoku-eval').text('Gomoku Evaluation: ' + analysis);

  if (check_gomoku_win(best_move[0], best_move[1])) {
    alert((blackturn ? "White":"Black") + " won!");
    return false;
  }
  return true;
}

function play_ai_both_gomoku() {
  setTimeout(function(){ if(play_ai_turn_gomoku()) play_ai_both_gomoku(); }, 20);
}

function new_game(length, handicap, starttime) {
  size = length;
  boardon = 0;
  boards = new Array(size * size * 2);
  captures = new Array(size * size * 2);
  captures[0] = [0, 0];
  seconds = new Array(size * size * 2);
  second = [starttime, starttime];
  seconds[0] = second;
  last_pieces = new Array(size * size * 2);
  last_pieces[0] = false;

  board = new Array(size);
  for (i = 0; i < board.length; i++) {
    board[i] = new Array(size);
    for (a = 0; a < board[i].length; a++)
      board[i][a] = ' ';
  }
  if (handicap > 1) {
    var quarter = Math.floor(Math.sqrt(size)) - 1;
    var half = (size - 1) / 2;
    set_turn(false);
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
  }
  else set_turn(true);
  boards[0] = board;
  wcaptures = bcaptures = 0;
  $('#black-stone').text(bcaptures);
  $('#white-stone').text(wcaptures);
  save_board(boardon, board);
  boardon++;
  max_turn = boardon;
  black_pass = false;
  ss = gowidth / size;
  draw_board();
  clearInterval(timer);
  timer = setInterval(function() { countdown(); }, 1000);

  if (game_type == 'Gomoku' && gomoku_ai) {
    if (ai_color == 'Black')
      play_ai_turn_gomoku();
    else if (ai_color == 'Both')
      play_ai_both_gomoku();
  }
}

$(document).ready(function() {

  docwidth = $("#content-wrapper").outerWidth(true);
  docheight = $("#content-wrapper").outerHeight(true);

  if (docwidth * 0.8 > docheight) {
    gowidth = docheight;
    $('#board').css('left', (docwidth * 0.8 - docheight)/3);
  }
  else gowidth = docwidth * 0.8;

  $('#board').width(gowidth).height(gowidth).css('top', (docheight - gowidth)/2);
  $('#settings-panel').width(docwidth - $('#board').outerWidth() - parseInt($('#board').css('left'), 10));

  goban.setAttribute('width', gowidth);
  goban.setAttribute('height', gowidth);

  board_top = $("#content-wrapper").position().top + $("#board").position().top;
  board_left = $("#board").position().left;

  new_game(19, 0, 300);
});

$(window).resize(function(event) {
  $("#content-wrapper").outerWidth($(window).outerWidth(true));
  $("#content-wrapper").outerHeight($(window).outerHeight(true) - $("#content-wrapper").position().top);

  docwidth = $("#content-wrapper").outerWidth(true);
  docheight = $("#content-wrapper").outerHeight(true);

  if (docwidth * 0.8 > docheight) {
    gowidth = docheight;
    $('#board').css('left', (docwidth * 0.8 - docheight)/3);
  }
  else gowidth = docwidth * 0.8;

  $('#board').width(gowidth).height(gowidth).css('top', (docheight - gowidth)/2);
  $('#settings-panel').width(docwidth - $('#board').outerWidth() - parseInt($('#board').css('left'), 10));

  goban.setAttribute('width', gowidth);
  goban.setAttribute('height', gowidth);

  board_top = $("#content-wrapper").position().top + $("#board").position().top;
  board_left = $("#board").position().left;

  ss = gowidth / size;

  draw_board();
});

function check_dead_helper(dead, kill_char)	{
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
        }
        else {
          if (i > 0 && board[i-1][a] == kill_char && dead[i-1][a] != -1) {
            dead[i-1][a] = -1;
            changed = true;
          }
          if (i < size - 1 && board[i+1][a] == kill_char && dead[i+1][a] != -1) {
            dead[i+1][a] = -1;
            changed = true;
          }
          if (a > 0 && board[i][a-1] == kill_char && dead[i][a-1] != -1) {
            dead[i][a-1] = -1;
            changed = true;
          }
          if (a < size - 1 && board[i][a+1] == kill_char && dead[i][a+1] != -1) {
            dead[i][a+1] = -1;
            changed = true;
          }
        }
      }

  return changed;
}

function check_dead(turn, x, y)	{
  var kill_char = turn ? 'B':'W';
  var dead = new Array(size);
  for (i = 0; i < dead.length; i++) {
    dead[i] = new Array(size);
    for (a = 0; a < dead[i].length; a++) {
      if (board[i][a] == ' ')
        dead[i][a] = 0;
      else dead[i][a] = 1;
    }
  }

  if (board[x][y] == kill_char)
    dead[x][y] = -1;
  else {
    if (x > 0 && board[x-1][y] == kill_char)
      dead[x-1][y] = -1;
    if (x < size - 1 && board[x+1][y] == kill_char)
      dead[x+1][y] = -1;
    if (y > 0 && board[x][y-1] == kill_char)
      dead[x][y-1] = -1;
    if (y < size - 1 && board[x][y+1] == kill_char)
      dead[x][y+1] = -1;
  }

  while (check_dead_helper(dead, kill_char));

  if (board[x][y] == kill_char)
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


function get_coord(loc) {
  return parseInt(loc / ss, 10);
}

function can_place_here(x, y, output) {
  if (board[x][y] != ' ') {
    if (output)
      alert("Illegal to place on stone!");
    return false;
  }
  return true;
}

$('#board').mousedown(function(e) { // place a piece
  if (e.which != 1) {
    draw_board();
    return;
  }
  var x = get_coord(e.pageX - board_left);
  var y = get_coord(e.pageY - board_top);

  if (can_place_here(x, y, false))
    board[x][y] = blackturn ? 'B':'W';
  else return;
  global_ROOT = MCTS_get_next_root([x, y]);


  if (game_type != "Gomoku") {
    check_dead(!blackturn, x, y);
    if(!check_dead(blackturn, x, y)) {
      board[x][y] = ' ';
      return;
    }
  }

  if (game_type != "Gomoku" && boardon > 3)
    if (equal(board, boards[boardon-2])) {
      set(board, get_board(boardon-1));
      get_captures(boardon-1);
      get_seconds(boardon-1);
      alert("Illegal ko move!");
      return;
    }

  last_piece = [x, y];
  save_board(boardon, board);
  $('#black-stone').text(bcaptures);
  $('#white-stone').text(wcaptures);
  boardon++;
  max_turn = boardon;
  set_turn(!blackturn);
  black_pass = false;
  draw_board();

  $('#gomoku-eval').text('Gomoku Evaluation: ' + analyze_gomoku(blackturn));

  if (game_type != "Go" && check_gomoku_win(x, y))
    alert((blackturn ? "White":"Black") + " won!");
  else if (game_type == 'Gomoku' && gomoku_ai)
    setTimeout(function(){ play_ai_turn_gomoku(); }, 20);
});

$('#board').mousemove(function(e) {
  var x = get_coord(e.pageX - board_left);
  var y = get_coord(e.pageY - board_top);

  if (can_place_here(x, y, false))
    draw_board(x, y, blackturn ? 'B':'W');
});

function convert_time(time_str) {
  time_str += '';
  var minutes = parseInt(time_str.substring(0, time_str.indexOf(':')), 10);
  var seconds = parseInt(time_str.substring(time_str.indexOf(':') + 1), 10);
  if (minutes > 59)
    minutes = 59;
  return minutes * 60 + seconds;
}

var dont_submit = false;

$('#form-new-game').submit(function() {
  if (dont_submit) {
    dont_submit = false;
    return false;
  }

  gomoku_ai = $('input[name="gomoku-ai"]').prop('checked');
  anti = $('input[name="anti-gomoku"]').prop('checked');
  game_type = $('input[name="game-types"]').val();
  ai_color = $('input[name="ai-color"]').val();
  ai_depth = $('input[name="ai-depth"]').val();

  new_game(parseInt($('input[name="board-size"]').val(), 10), parseInt($('input[name="handicap"]').val(), 10), convert_time($('input[name="time-control"]').val()));

  $('#new-game-menu').animate({opacity: 0}, "slow", function() {
    $(this).css('z-index', -1);
  });
  return false;
});

$('#btn-new-game').click(function() {
  $('#new-game-menu').animate({opacity: 1}, "slow").css('z-index', 1);
});

$('#btn-new-game-cancel').click(function() {
  dont_submit = true;
  $('#new-game-menu').animate({opacity: 0}, "slow", function() {
    $(this).css('z-index', -1);
  });
});

$('#btn-undo').click(function() {
  if (boardon < 2) {
    alert("No moves to undo");
    return;
  }
  else {
    set(board, get_board(boardon-2));
    boardon--;
    set_turn(!blackturn);
    $('#gomoku-eval').text('Gomoku Evaluation: ' + analyze_gomoku(blackturn));
  }
  draw_board();
});

$('#btn-redo').click(function() {
  if (boardon >= max_turn) {
    alert("No moves to redo");
    return;
  }
  else {
    set(board, get_board(boardon));
    boardon++;
    set_turn(!blackturn);
    $('#gomoku-eval').text('Gomoku Evaluation: ' + analyze_gomoku(blackturn));
  }
  draw_board();
});

$('#btn-pass').click(function() {
  if (blackturn)
    black_pass = true;
  else if (black_pass)
    alert("Game over!");
  set_turn(!blackturn);
  draw_board();
});
