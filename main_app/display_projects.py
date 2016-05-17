# coding: utf-8

games = {
	'name': 'Games',
	'id': 'games',
	'header': 'Games (Most with AIs)',
	'list': [
		{
			'redirect': '/games/ConnectFour/',
			'imagesrc': '/static/images/main_app/connect-4.jpg',
			'description': 'Perhaps my strongest AI, my Connect Four Monte Carlo tree search AI is very powerful and very fast!',
		},
		{
			'redirect': '/games/OnlineGo/',
			'imagesrc': '/static/images/main_app/board-game-go.jpg',
			'description': 'Play Go, Gomoku, or Wu. The only one with an AI—however—is Gomoku—with a Minimax implementation.',
		},
		{
			'redirect': '/games/Mancala/',
			'imagesrc': '/static/images/main_app/mancala.JPG',
			'description': 'My first Monte Carlo tree search AI! The game itself is programmed with a customizable set of rules.',
		},
		{
			'redirect': '/games/UltimateTicTacToe/',
			'imagesrc': '/static/images/main_app/Ultimate-Tic-Tac-Toe.jpg',
			'description': 'An AI I literally whipped over two nights—the interface is slightly lacking—but plays well nonetheless.',
		},
		{
			'redirect': '/games/LameDuck/',
			'imagesrc': '/static/images/main_app/duck.svg',
			'description': 'This game precedes this website by half a year, and was made in a few hours. It seems to be the largest attraction of my site for some reason.',
		},
	],
}
tools = {
	'name': 'Tools',
	'id': 'tools',
	'header': 'Tools and other Math Stuff',
	'list': [
		{
			'redirect': '/tools/Maze/',
			'imagesrc': '/static/images/main_app/maze.png',
			'description': 'A <a href="https://en.wikipedia.org/wiki/Maze_generation_algorithm#Depth-first_search">depth-first search maze generator</a> with a generation <strong>animation option</strong> and maze styles!',
		},
		{
			'redirect': '/tools/PrimeFactorizer/',
			'imagesrc': '/static/images/main_app/factor-tree.gif',
			'description': 'A super-fast prime number factorizer that uses a sieve of a size that you get to input!',
		},
		{
			'redirect': '/tools/ImageEditor/',
			'imagesrc': '/static/images/main_app/image-editor.jpg',
			'description': 'A neat little image editor that has many effects. Press \'c\' to enter commands.',
		},
		{
			'redirect': '/tools/Grapher/',
			'imagesrc': '/static/images/main_app/grapher.gif',
			'description': 'A function grapher with a neat tracing and newtons\' method (click \'n\' in trace mode).',
		},
		{
			'redirect': '/tools/HappyNumbers/',
			'imagesrc': '/static/images/main_app/happy-number.png',
			'description': 'A <a href="https://en.wikipedia.org/wiki/Happy_number">Happy Number</a> calculator.',
		},
		{
			'redirect': '/tools/ReveresLatsLettesr/',
			'imagesrc': '/static/images/main_app/4600275420_c7bfb8466d.jpg',
			'description': 'Reverse the last two characters of words :P',
		},
	],
}

projects = [
	games,
	tools,
]