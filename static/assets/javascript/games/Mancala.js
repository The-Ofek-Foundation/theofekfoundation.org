var docwidth, docheight;
var pits = 6;
var seeds_per_pit = 4;
var board, board_copy;
var top_turn_global;
var monte_carlo_trials = 200000;
var ai = -1;
var capturing_rules = "Same Side and Opposite Occupied";
var reverse_drawing = true;
var last_capture_global, last_move_global, last_sow_global;
var global_ROOT;
var expansion_const = 3.5;
var board_states, state_on;
var ponder = false, pondering;
var last_rec;
var certainty_threshold = 0.5;
var monte_carlo_aide = false;
var MCTS_weights = false;
var max_trials = 1500000; // prevents overload (occurs around 2.3 million)
var wrapper_top;
var num_choose1, num_choose2, num_choose3, lnc1, lnc2, lnc3, stop_choose;

var boardui = document.getElementById("board");
var brush = boardui.getContext("2d");

$(document).ready(function() {

  docwidth = $("#content-wrapper").outerWidth(true);
  docheight = $("#content-wrapper").outerHeight(true);
  wrapper_top = $("#content-wrapper").position().top;

  $('#board').width(docwidth).height(docheight);

  boardui.setAttribute('width', docwidth);
  boardui.setAttribute('height', docheight);

  new_game();

  $("#form-new-game").height(docheight * 0.6);

  $('.center-btn').css('font-size', docheight / 10);
  $('#undo-btn').css('top', (docheight- $('#undo-btn').height()) / 2);
  $('#redo-btn').css('top', (docheight - $('#redo-btn').height()) / 2);
  $('#new-game-btn').css('top', (docheight - $('#new-game-btn').height()) / 2);
  $('#new-game-btn').css('left', (docwidth - $('#new-game-btn').outerWidth()) / 2);
  $('#new-game-menu').css('top', (docheight - $('#new-game-menu').outerHeight()) / 2);
  $('#new-game-menu').css('left', (docwidth - $('#new-game-menu').outerWidth()) / 2);
});

$(window).resize(function() {
  $("#content-wrapper").outerWidth($(window).outerWidth(true));
  $("#content-wrapper").outerHeight($(window).outerHeight(true) - $("#content-wrapper").position().top);

  docwidth = $("#content-wrapper").outerWidth(true);
  docheight = $("#content-wrapper").outerHeight(true);

  $("#form-new-game").height(docheight * 0.6);

  boardui.setAttribute('width', docwidth);
  boardui.setAttribute('height', docheight);

  oval_width = docwidth / (pits + 3);
  oval_height = docheight / 5;

  wrapper_top = $("#content-wrapper").position().top;

  $('#board').width(docwidth).height(docheight);

  $('.center-btn').css('font-size', docheight / 10);
  $('#undo-btn').css('top', (docheight- $('#undo-btn').height()) / 2);
  $('#redo-btn').css('top', (docheight - $('#redo-btn').height()) / 2);
  $('#new-game-btn').css('top', (docheight - $('#new-game-btn').height()) / 2);
  $('#new-game-btn').css('left', (docwidth - $('#new-game-btn').outerWidth()) / 2);
  $('#new-game-menu').css('top', (docheight - $('#new-game-menu').outerHeight()) / 2);
  $('#new-game-menu').css('left', (docwidth - $('#new-game-menu').outerWidth()) / 2);

  draw_board();
});

function new_game() {
  board = new Array(pits * 2 + 2);
  for (var i = 0; i < pits * 2 + 2; i++)
    board[i] = seeds_per_pit;
  board[0] = board[pits + 1] = 0;
  top_turn_global = true;
  last_sow_global = last_capture_global = last_move_global = -1;
  board_states = [];
  state_on = 0;
  save_board_state(state_on);
  last_rec = null;
  global_ROOT = create_MCTS_root();
  num_choose1 = num_choose2 = num_choose3 = lnc1 = lnc2 = lnc3 = stop_choose = false;

  oval_width = docwidth / (pits + 3);
  oval_height = docheight / 5;
  draw_board();
  adjust_buttons();

  if (ai == "First" || ai == "Both")
    setTimeout(play_monte_carlo_ai_move, 30);

  stop_ponder();
  if (ponder)
    start_ponder();
}

function play_move(pit_loc) {

  if (!sow(pit_loc)) {
    top_turn_global = !top_turn_global;
    num_choose1 = num_choose2 = num_choose3 = stop_choose = false;
  }

  if(end_game(top_turn_global))
    if (ponder)
      stop_ponder();

  state_on++;
  save_board_state(state_on);

  global_ROOT = MCTS_get_next_root(pit_loc);
  if (global_ROOT)
    global_ROOT.parent = null;
  else global_ROOT = create_MCTS_root();

  update_analysis();

  draw_board();

  if (ai == "Both" || (ai == "First" && top_turn_global) || (ai == "Second" && !top_turn_global))
    setTimeout(play_monte_carlo_ai_move, 30);
}

function save_board_state(index) {
  board_states = board_states.slice(0, index);
  board_states[index] = new State(board.slice(0), top_turn_global);
  board_states[index].last_capture_global = last_capture_global;
  board_states[index].last_move_global = last_move_global;
  board_states[index].last_sow_global = last_sow_global;
}

function load_board_state(index) {
  board = board_states[index].board.slice(0);
  top_turn_global = board_states[index].turn;
  num_choose1 = num_choose2 = num_choose3 = stop_choose = false;
  last_capture_global = board_states[index].last_capture_global;
  last_move_global = board_states[index].last_move_global;
  last_sow_global = board_states[index].last_sow_global;
}

function undo() {
  if (state_on === 0) {
    alert("No moves left to undo!");
    return;
  }
  state_on--;
  load_board_state(state_on);
  global_ROOT = null;
  draw_board();
  if (pondering) {
    stop_ponder();
    start_ponder();
  }
}

function redo() {
  if (state_on >= board_states.length - 1) {
    alert("No moves left to redo!");
    return;
  }
  state_on++;
  load_board_state(state_on);
  draw_board();
}

function start_ponder() {
  pondering = setInterval(function() {
    if (!global_ROOT)
      global_ROOT = create_MCTS_root();
    var start_time = new Date().getTime();
    var temp_count = 0;
    while ((new Date().getTime() - start_time) < 30 && !stop_choose) {
      global_ROOT.choose_child();
      temp_count++;
    }
    if (num_choose3 && (temp_count < num_choose3 / 10 || temp_count < num_choose2 / 10 || temp_count < num_choose1 / 10))
      stop_choose = true;
    else {
      num_choose3 = num_choose2;
      num_choose2 = num_choose1;
      num_choose1 = temp_count;
    }
    last_rec = most_tried_child(global_ROOT, null);
    update_analysis();
    if (MCTS_weights && Math.random() > 0.9)
      draw_board();
  }, 1);
}

function adjust_buttons() {
  $('.footer button').css('font-size', oval_height / 4);
  $('.footer').css("height", oval_height / 2 + "px");
//   $('.footer').css('margin-bottom', oval_height / 2 - $('#anal').outerHeight(false));
  $('.footer #anal').css('line-height', oval_height / 2 + "px");
  $('.footer #num-trials').css('line-height', oval_height / 2 + "px");
}

function update_analysis() {
  var range = get_MCTS_depth_range();
  $('#anal').text("Analysis: Best-" + range[1] +" Worst-" + range[0] + " Result-" + range[2]);
  $('#num-trials').text("Trials: " + global_ROOT.total_tries);
}

function stop_ponder() {
  clearInterval(pondering);
}

function create_MCTS_root() {
  return new MCTS_Node(new State(board, top_turn_global), null, null);
}

function MCTS_get_next_root(pit_loc) {
  if (!global_ROOT || !global_ROOT.children)
    return null;
  for (var i = 0; i < global_ROOT.children.length; i++)
    if (global_ROOT.children[i].last_move == pit_loc) {
      return global_ROOT.children[i];
    }
  return null;
}

function run_MCTS(times, threshold, callback) {
  if (!global_ROOT)
    global_ROOT = create_MCTS_root();
  run_MCTS_recursive(times, threshold, 10, 10, callback);
}

function run_MCTS_recursive(times, threshold, time_on, total_times, callback) {
  for (var a = 0; a < times / total_times; a++)
    global_ROOT.choose_child();
//   if (last_rec != most_tried_child(global_ROOT, null)) {
    last_rec = most_tried_child(global_ROOT, null);
    update_analysis();
    if (MCTS_weights)
      draw_board();
//   }
  if (threshold > 0) {
    if (global_ROOT.children.length < 2) {
      callback(global_ROOT);
      return;
    }
    var cert = get_certainty(global_ROOT);
    console.log(cert, threshold);
    if (cert < threshold) {
      callback(global_ROOT);
      return;
    }
  }
  if (time_on <= 1)
    callback(global_ROOT);
  else setTimeout(function() {
    run_MCTS_recursive(times, threshold, time_on - 1, total_times, callback);
  }, 30);
}

function get_certainty(root) {
  var best_child = most_tried_child(root, null);
  var ratio = most_tried_child(root, best_child).total_tries / best_child.total_tries;
  var ratio_wins = best_child.hits < best_child.misses ? (best_child.hits / best_child.misses * 2):(best_child.misses / best_child.hits * 3);
  return ratio > ratio_wins ? ratio_wins:ratio;
}

function most_tried_child(root, exclude) {
  var most_trials = 0, child = null;
  if (!root.children)
    return null;
  if (root.children.length == 1)
    return root.children[0];
  for (var i = 0; i < root.children.length; i++)
    if (root.children[i] != exclude && root.children[i].total_tries > most_trials) {
      most_trials = root.children[i].total_tries;
      child = root.children[i];
    }
  return child;
}

function least_tried_child(root) {
  var least_trials = root.total_tries + 1, child = null;
  if (!root.children)
    return null;
  for (var i = 0; i < root.children.length; i++)
    if (root.children[i].total_tries < least_trials) {
      least_trials = root.children[i].total_tries;
      child = root.children[i];
    }
  return child;
}

function get_best_move_MCTS(callback) {
  var best_child;
  if (callback && global_ROOT.total_tries < monte_carlo_trials) {
    run_MCTS(monte_carlo_trials - global_ROOT.total_tries, certainty_threshold, function() {
//       console.log("finish");
      best_child = most_tried_child(global_ROOT, null);
      if (!best_child)
        callback(-1);
      else callback(best_child.last_move);
    });
  }
  else if (callback) {
    best_child = most_tried_child(global_ROOT, null);
    if (!best_child)
      callback(-1);
    else callback(best_child.last_move);
  }
  else {
    best_child = most_tried_child(global_ROOT, null);
    if (!best_child)
      return -1;
    return best_child.last_move;
  }
}

function get_MCTS_depth_range() {
  var root, range = new Array(3);
  for (range[0] = -1, root = global_ROOT; root && root.children; range[0]++, root = least_tried_child(root));
  for (range[1] = -1, root = global_ROOT; root && root.children; range[1]++, root = most_tried_child(root));
  root = global_ROOT;
  if (root.total_tries > (root.hits + root.misses) * 2)
    range[2] = "Tie";
  else if ((root.hits > root.misses) == top_turn_global)
    range[2] = "First";
  else if ((root.hits < root.misses) == top_turn_global)
    range[2] = "Second";
  else range[2] = "Tie";
  return range;
}

function analyze_position(top_turn) {
  return (top_turn ? (board[pits + 1] - board[0]):(board[0] - board[pits + 1]));
}

function MCTS_analyze_position(tboard, top_turn) {
  return (top_turn ? (tboard[pits + 1] - tboard[0]):(tboard[0] - tboard[pits + 1]));
}

function MCTS_get_children(state, father) {
  var temp_board = state.board.slice(0);
  var top_turn = state.turn;
  var i;

  var possible_moves = [];
  for (i = 0; i < pits; i++)
    if (!MCTS_illegal_move(temp_board, i + (top_turn ? 1:(2 + pits)), top_turn))
      possible_moves[possible_moves.length] = i + (top_turn ? 1:(2 + pits));

  var possible_children = new Array(possible_moves.length);

  for (i = 0; i < possible_children.length; i++) {
    if (!MCTS_sow(temp_board, possible_moves[i]))
      top_turn = !top_turn;
    MCTS_end_game(temp_board, top_turn);
    possible_children[i] = new MCTS_Node(new State(temp_board, top_turn), father, possible_moves[i]);

    temp_board = state.board.slice(0);
    top_turn = state.turn;
  }

  return possible_children;
}

function MCTS_simulate(State) {
  var temp_board = State.board.slice(0);
  var top_turn = State.turn;

  var possible_moves = [];
  for (var i = 0; i < pits; i++)
    if (!MCTS_illegal_move(temp_board, i + (top_turn ? 1:(2 + pits)), top_turn))
      possible_moves[possible_moves.length] = i + (top_turn ? 1:(2 + pits));

  return MCTS_simulate_game(temp_board, top_turn, top_turn, possible_moves[parseInt(Math.random() * possible_moves.length)]);
}

function get_end(pit_loc, seed_num, top_turn) {
  var end;
  if (top_turn) {
    end = (pit_loc + seed_num) % (2 * pits + 1);
    if (end === 0)
      return 2 * pits + 1;
    return end;
  }
  end = ((pit_loc + seed_num - pits - 1) % (2 * pits + 1) + pits + 1) % (2*pits + 2);
  if (end == pits + 1)
    return pits;
  return end;
}

function MCTS_promising_moves(tboard, possible_moves, top_turn) {
  var promising_moves = [];
  var end;
  for (var i = 0; i < possible_moves.length; i++) {
    end = get_end(possible_moves[i], tboard[possible_moves[i]], top_turn);
    if (end === 0 || end == pits + 1)
      promising_moves.push(possible_moves[i]);
    else switch (capturing_rules) {
      case "No Capturing":
        break;
      case "Always Capturing":
        if (board[end] == 1)
          promising_moves.push(possible_moves[i]);
        break;
      case "Opposite Occupied":
        if (board[end] == 1 && tboard[2 * pits + 2 - end] > 0)
          promising_moves.push(possible_moves[i]);
        break;
      case "Same Side and Opposite Occupied":
        if (((end <= pits && top_turn) || (end > pits && !top_turn)) && tboard[end] == 1 && tboard[2 * pits + 2 - end] > 0)
          promising_moves.push(possible_moves[i]);
        break;
    }
  }
  return promising_moves;
}

function MCTS_simulate_game(tboard, global_turn, top_turn, pit_loc) {
  if (!MCTS_sow(tboard, pit_loc))
    top_turn = !top_turn;

  if (MCTS_end_game(tboard, top_turn) || tboard[0] > pits * seeds_per_pit || tboard[pits + 1] > pits * seeds_per_pit)
    return MCTS_analyze_position(tboard, global_turn);

  var possible_moves = [];
  for (var i = 0; i < pits; i++)
    if (!MCTS_illegal_move(tboard, i + (top_turn ? 1:(2 + pits)), top_turn))
      possible_moves.push(i + (top_turn ? 1:(2 + pits)));

  var promising_moves = MCTS_promising_moves(tboard, possible_moves, top_turn);

  possible_moves = possible_moves.concat(promising_moves).concat(promising_moves);

  return MCTS_simulate_game(tboard, global_turn, top_turn, possible_moves[Math.floor(Math.random() * possible_moves.length)]);
}

function simulate_game(pit_loc, top_turn) {
  if (!sow(pit_loc))
    top_turn = !top_turn;

  if (end_game(top_turn))
    return analyze_position(top_turn_global);

  var possible_moves = [];
  for (var i = 0; i < pits; i++)
    if (!illegal_move(i + (top_turn ? 1:(2 + pits)), top_turn, false))
      possible_moves[possible_moves.length] = i + (top_turn ? 1:(2 + pits));

  return simulate_game(possible_moves[parseInt(Math.random() * possible_moves.length)], top_turn);
}

function monte_carlo_analyze_pit(pit_loc) {
  var hits = 0;
  var misses = 0;
  var result;
  board_copy = board.slice(0);

  for (var i = 0; i < monte_carlo_trials; i++) {
    result = simulate_game(pit_loc, top_turn_global);
    if (result < 0)
      misses++;
    else if (result > 0)
      hits++;
    board = board_copy.slice(0);
  }
  return hits / misses;
}

function monte_carlo_analysis() {
  var analyses = Array(pits);

  for (var i = 0; i < pits; i++) {
    if (!illegal_move(i + (top_turn_global ? 1:(2 + pits)), top_turn_global, false))
      analyses[i] = monte_carlo_analyze_pit(i + (top_turn_global ? 1:(2 + pits)));
    else analyses[i] = -1;
  }
  return analyses;
}

function play_monte_carlo_ai_move() {
 get_best_move_MCTS(function(best_move) {
  console.log(best_move);
  play_move(best_move);
 });
}

function drawEllipse(x, y, w, h) {
  var kappa = 0.5522848,
      ox = (w / 2) * kappa, // control point offset horizontal
      oy = (h / 2) * kappa, // control point offset vertical
      xe = x + w,           // x-end
      ye = y + h,           // y-end
      xm = x + w / 2,       // x-middle
      ym = y + h / 2;       // y-middle

  brush.moveTo(x, ym);
  brush.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
  brush.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
  brush.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
  brush.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
}

function clear_board() {
  brush.clearRect(0, 0, docwidth, docheight);
}

function get_pit_color(ratio) {
  var r, g = 0, b = 0;
  r = Math.floor(ratio * 255);

  return "rgb(" + r + "," + g + "," + b + ")";
}

function draw_pit(pit_loc, x, y, width, height) {
  brush.beginPath();
  drawEllipse(x, y, width, height);
  if (last_move_global < 0 || last_sow_global < 0);
  else if (pit_loc == last_move_global) {
    brush.fillStyle = "#76EE00"; // green
    brush.fill();
  }
  else if (pit_loc == last_capture_global) {
    brush.fillStyle = "#CD3333"; // light red
    brush.fill();
  }
  else if (pit_loc == last_sow_global) {
    brush.fillStyle = "#815532"; // brown
    brush.fill();
  }
  else if (board[last_move_global] > 0 || last_sow_global == last_move_global || (last_sow_global > last_move_global && pit_loc > last_move_global && pit_loc < last_sow_global) || (last_sow_global < last_move_global && (pit_loc > last_move_global || pit_loc < last_sow_global))) {
    if ((pit_loc === 0 && !top_turn_global) || (pit_loc == pits + 1 && top_turn_global));
    else {
      brush.fillStyle = "#C3834C"; // light brown
      brush.fill();
    }
  }
  if (last_rec && monte_carlo_aide && pit_loc == last_rec.last_move)
    brush.strokeStyle = "blue";
  else brush.strokeStyle = "black";
  if (MCTS_weights && MCTS_get_next_root(pit_loc)) {
    var tries = MCTS_get_next_root(pit_loc).total_tries;
    var ratio = tries / global_ROOT.total_tries;
    brush.lineWidth = ratio * 2 * pits;
//     brush.strokeStyle = get_pit_color(ratio);
  }
  else  brush.lineWidth = 2;
  brush.stroke();
  brush.fillStyle = "black";
  brush.shadowBlur = 0;
}

var oval_width, oval_height;

function draw_board() {

  clear_board();

  var large_oval_height = parseInt(boardui.getAttribute("height")) - 2 * oval_height;
  var top_text = oval_width / 7;
  brush.font = (oval_width / 3) + "px Arial";
  brush.textAlign = "center";

  // large ovals

  brush.strokeStyle = "black";

  brush.beginPath();
  draw_pit(0, 1 / 4 * oval_width, (parseInt(boardui.getAttribute("height")) - large_oval_height) / 2, oval_width, large_oval_height);
  brush.fillText(board[0], 3 / 4 * oval_width, parseInt(boardui.getAttribute("height")) / 2 + top_text);

  draw_pit(pits + 1, parseInt(boardui.getAttribute("width")) - 5 / 4 * oval_width, (parseInt(boardui.getAttribute("height")) - large_oval_height) / 2, oval_width, large_oval_height);
  brush.fillText(board[pits + 1], parseInt(boardui.getAttribute("width")) - 3 / 4 * oval_width, parseInt(boardui.getAttribute("height")) / 2 + top_text);
  brush.stroke();

  // small ovals

  for (var i = 0; i < pits; i++) {
    draw_pit(reverse_drawing ? (2 * pits - i + 1):(i + 1), (i + 1.5) * oval_width, oval_height, oval_width, oval_height);
    brush.fillText(reverse_drawing ? board[2 * pits - i + 1]:board[i + 1], (i + 2) * oval_width, oval_height * 1.5 + top_text);

    draw_pit(reverse_drawing ? (i+1):(2 * pits - i + 1), (i + 1.5) * oval_width, oval_height * 3, oval_width, oval_height);
    brush.fillText(reverse_drawing ? board[i+1]:board[2 * pits - i + 1], (i + 2) * oval_width, oval_height * 3.5 + top_text);
  }
}

function get_pit_loc(x, y) {
  y -= wrapper_top;

  x = Math.floor((x - oval_width * 1.5) / oval_width);
  y = Math.floor((y - oval_height) / oval_height);

  if (x < 0 || y < 0 || x >= pits || y == 1 || y > 2)
    return -1;

  if (reverse_drawing)
    y = 2 - y;

  return x + 1 + (y > 0 ? (2 * (pits - x)):0);
}

$('#board').mousedown(function(e) {
  if (ai === top_turn_global) {
    alert("It is not your turn!");
    return;
  }
  var pit_loc = get_pit_loc(e.pageX, e.pageY);
  if (illegal_move(pit_loc, top_turn_global, true))
    return;

  play_move(pit_loc);
});

function illegal_move(pit_loc, top_turn, output) {
  if (pit_loc < 0)
    return true;
  if ((top_turn && pit_loc > pits) || (!top_turn && pit_loc <= pits)) {
    if (output)
      alert("It is not your turn!");
    return true;
  }
  if (board[pit_loc] === 0) {
    if (output)
      alert("No seeds to sow");
    return true;
  }
  return false;
}

function MCTS_illegal_move(tboard, pit_loc, top_turn) {
  if (pit_loc < 0)
    return true;
  if ((top_turn && pit_loc > pits) || (!top_turn && pit_loc <= pits))
    return true;
  if (tboard[pit_loc] === 0)
    return true;
  return false;
}

function capture_pit(pit_loc, top_turn) {
  var captures = board[pit_loc];
  board[pit_loc] = 0;
  if (capturing_rules == "Always Capturing")
    last_capture_global = pit_loc;

  pit_loc = 2 * pits + 2 - pit_loc;
  captures += board[pit_loc];
  if (board[pit_loc] > 0)
    last_capture_global = pit_loc;
  board[pit_loc] = 0;

  if (top_turn)
    board[pits + 1] += captures;
  else board[0] += captures;
}

function MCTS_capture_pit(tboard, pit_loc, top_turn) {
  var captures = tboard[pit_loc];
  tboard[pit_loc] = 0;

  pit_loc = 2 * pits + 2 - pit_loc;
  captures += tboard[pit_loc];
  tboard[pit_loc] = 0;

  if (top_turn)
    tboard[pits + 1] += captures;
  else tboard[0] += captures;
}

function sow(pit_loc) {
  last_move_global = pit_loc;
  var num_seeds = board[pit_loc];
  var top_turn = pit_loc > pits ? false:true;
  var curr_pit = pit_loc;
  board[pit_loc] = 0;

  for (var i = 0; i < num_seeds; i++) {
    curr_pit++;
    curr_pit = curr_pit % (pits * 2 + 2);
    if ((top_turn && curr_pit === 0) || (!top_turn && curr_pit == pits + 1))
      curr_pit++;
    board[curr_pit]++;
  }

  last_capture_global = -1;
  if (!(curr_pit === 0 || curr_pit == pits + 1) && capturing_rules) {
    switch (capturing_rules) {
      case "No Capturing":
        break;
      case "Always Capturing":
        if (board[curr_pit] == 1)
          capture_pit(curr_pit, top_turn);
        break;
      case "Opposite Occupied":
        if (board[curr_pit] == 1 && board[2 * pits + 2 - curr_pit] > 0)
          capture_pit(curr_pit, top_turn);
        break;
      case "Same Side and Opposite Occupied":
        if (((curr_pit <= pits && top_turn) || (curr_pit > pits && !top_turn)) && board[curr_pit] == 1 && board[2 * pits + 2 - curr_pit] > 0)
          capture_pit(curr_pit, top_turn);
        break;
    }
  }

  last_sow_global = curr_pit;
  return curr_pit === 0 || curr_pit == pits + 1;
}

function MCTS_sow(tboard, pit_loc) {
  var num_seeds = tboard[pit_loc];
  var top_turn = pit_loc > pits ? false:true;
  var curr_pit = pit_loc;
  tboard[pit_loc] = 0;

  for (var i = 0; i < num_seeds; i++) {
    curr_pit++;
    curr_pit = curr_pit % (pits * 2 + 2);
    if ((top_turn && curr_pit === 0) || (!top_turn && curr_pit == pits + 1))
      curr_pit++;
    tboard[curr_pit]++;
  }

  if (!(curr_pit === 0 || curr_pit == pits + 1)) {
    switch (capturing_rules) {
      case "No Capturing":
        break;
      case "Always Capturing":
        if (tboard[curr_pit] == 1)
          MCTS_capture_pit(tboard, curr_pit, top_turn);
        break;
      case "Opposite Occupied":
        if (tboard[curr_pit] == 1 && tboard[2 * pits + 2 - curr_pit] > 0)
          MCTS_capture_pit(tboard, curr_pit, top_turn);
        break;
      case "Same Side and Opposite Occupied":
        if (((curr_pit <= pits && top_turn) || (curr_pit > pits && !top_turn)) && tboard[curr_pit] == 1 && tboard[2 * pits + 2 - curr_pit] > 0)
          MCTS_capture_pit(tboard, curr_pit, top_turn);
        break;
    }
  }

  return curr_pit === 0 || curr_pit == pits + 1;
}

function end_game(top_turn) {
  var i;

  for (i = 1; i <= pits; i++)
    if ((!top_turn && board[i+pits+1] > 0) || (top_turn && board[i] > 0))
      return false;

  var captures = 0;

  for (i = 1; i <= pits; i++) {
    captures += board[i];
    board[i] = 0;
  }
  board[pits + 1] += captures;

  captures = 0;

  for (i = pits + 2; i < board.length; i++) {
    captures += board[i];
    board[i] = 0;
  }
  board[0] += captures;

  last_sow_global = -1;

  stop_ponder();

  return true;
}

function MCTS_end_game(tboard, top_turn) {
  var i;

  for (i = 1; i <= pits; i++)
    if ((!top_turn && tboard[i+pits+1] > 0) || (top_turn && tboard[i] > 0))
      return false;

  var captures = 0;

  for (i = 1; i <= pits; i++) {
    captures += tboard[i];
    tboard[i] = 0;
  }
  tboard[pits + 1] += captures;

  captures = 0;

  for (i = pits + 2; i < tboard.length; i++) {
    captures += tboard[i];
    tboard[i] = 0;
  }
  tboard[0] += captures;

  return true;
}

$(document).keydown(function(e) {
  if (e.ctrlKey)
    return;
  switch (e.which) {
    case 78: // n
      show_new_game_menu();
      break;
    case 85: // u
      undo();
      break;
    case 82: // r
      redo();
      break;
  }
});

function show_new_game_menu() {
  $('#new-game-menu').animate({opacity: 0.9}, "slow").css('z-index', 100);
}

var dont_submit;

$('#form-new-game').submit(function() {
  if (dont_submit) {
    dont_submit = false;
    return false;
  }

  pits = parseInt($('input[name="num-pits"]').val());
  seeds_per_pit = parseInt($('input[name="seeds-per-pit"]').val());

  var ai_playing = $('input[name="ai"]').prop('checked');
  ponder = $('input[name="ai-ponder"]').prop('checked');
  MCTS_weights = $('input[name="mc-weight"]').prop('checked');
  capturing_rules = $('input[name="capture-rules"]').val();
  reverse_drawing = $('input[name="reverse"]').prop('checked');
  ai = $('input[name="ai-turn"]').val();
  if (!ai_playing)
    ai = -1;
  monte_carlo_trials = $('input[name="mc-trials"]').val();
  expansion_const = $('input[name="mc-expansion"]').val();
  certainty_threshold = 1 - $('input[name="mc-certainty"]').val() / 100;

  $('#new-game-menu').animate({opacity: 0}, "slow", function() {
    $(this).css('z-index', -1);
    new_game();
  });

  return false;
});

$('#btn-new-game-cancel').click(function() {
  dont_submit = true;
  $('#new-game-menu').animate({opacity: 0}, "slow", function() {
    $(this).css('z-index', -1);
  });
});

var State = function(board, turn) {
  this.board = board;
  this.turn = turn;
};

function child_potential(child, t, turn) {
  var w;
  if (child.State.turn === turn)
    w = child.hits - child.misses;
  else w = child.misses - child.hits;
  var n = child.total_tries;
  var c = expansion_const;

  return w / n  +  c * Math.sqrt(Math.log(t) / n);
}

var MCTS_Node = function(State, parent, last_move) {
  this.State = State;
  this.parent = parent;
  this.last_move = last_move;
  this.hits = 0;
  this.misses = 0;
  this.total_tries = 0;
};

MCTS_Node.prototype.choose_child = function() {
  if (!this.children)
    this.children = MCTS_get_children(this.State, this);
  if (this.children.length === 0) // leaf node
    this.run_simulation();
  else {
    var i;
    var unexplored = [];
    for (i = 0; i < this.children.length; i++)
      if (this.children[i].total_tries === 0)
        unexplored.push(this.children[i]);

    if (unexplored.length > 0)
      unexplored[Math.floor(Math.random() * unexplored.length)].run_simulation();
    else {
      var best_child = this.children[0], best_potential = child_potential(this.children[0], this.total_tries, this.State.turn), potential;
      for (i = 1; i < this.children.length; i++) {
        potential = child_potential(this.children[i], this.total_tries, this.State.turn);
        if (potential > best_potential) {
          best_potential = potential;
          best_child = this.children[i];
        }
      }
      best_child.choose_child();
    }
  }
};

MCTS_Node.prototype.run_simulation = function() {
  this.back_propogate(MCTS_simulate(this.State));
};

MCTS_Node.prototype.back_propogate = function(simulation) {
  if (simulation > 0)
    this.hits++;
  else if (simulation < 0)
    this.misses++;
  this.total_tries++;
  if (this.parent) {
    if (this.parent.State.turn === this.State.turn)
      this.parent.back_propogate(simulation);
    else this.parent.back_propogate(-simulation);
  }
};