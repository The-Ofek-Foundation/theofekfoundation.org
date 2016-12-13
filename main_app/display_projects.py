# coding: utf-8

games = {
	'name': 'Games',
	'id': 'games',
	'header': 'Games (Most with AIs)',
	'list': [
		{
			'name': 'Connect Four',
			'imagesrc': 'connect-4.jpg',
			'description': 'Perhaps my strongest AI, my Connect Four Monte Carlo tree search AI is very powerful and very fast!',
			'template': 'games/ConnectFourDescription.html',
			'save': True,
		},	{
			'name': 'Ultimate Tic Tac Toe',
			'imagesrc': 'Ultimate-Tic-Tac-Toe.jpg',
			'description': 'An AI I literally whipped over two nights—the interface is slightly lacking—but plays well nonetheless.',
			'template': 'games/UltimateTicTacToeDescription.html',
			'save': True,
		},	{
			'name': 'Old Snakey',
			'imagesrc': 'snakey_level_1.gif',
			'description': 'The good old retro game of Old Snakey, coded with multiple AIs (that you can simultaneously play against!)',
			'template': 'games/OldSnakeyDescription.html',
			'save': True,
		},	{
			'name': 'Weiqi',
			'imagesrc': 'board-game-go.jpg',
			'description': 'Play Go, Gomoku, or Wu. The only one with an AI—however—is Gomoku—with a Minimax implementation.',
			'template': 'games/ConnectFourDescription.html',
			# 'template': 'games/WeiqiDescription.html',
			'save': False,
		},	{
			'name': 'Mancala',
			'imagesrc': 'mancala.JPG',
			'description': 'My first Monte Carlo tree search AI! The game itself is programmed with a customizable set of rules.',
			'template': 'games/ConnectFourDescription.html',
			# 'template': 'games/MancalaDescription.html',
			'save': False,
		},	{
			'name': 'Lame Duck',
			'imagesrc': 'duck.svg',
			'description': 'This game precedes this website by half a year, and was made in a few hours. It seems to be the largest attraction of my site for some reason.',
			'template': 'games/ConnectFourDescription.html',
			# 'template': 'games/LameDuckDescription.html',
			'save': False,
		},
	],
}
tools = {
	'name': 'Tools',
	'id': 'tools',
	'header': 'Tools and other Math Stuff',
	'list': [
		{
			'name': 'Maze Generator',
			'imagesrc': 'maze.png',
			'description': 'A <a class="animated" href="https://en.wikipedia.org/wiki/Maze_generation_algorithm#Depth-first_search">depth-first search maze generator</a> with a generation <strong>animation option</strong> and maze styles!',
		},	{
			'name': 'Prime Factorizer',
			'imagesrc': 'factor-tree.gif',
			'description': 'A super-fast prime number factorizer that uses a sieve of a size that you get to input!',
		},	{
		# 	'name': 'Image Editor',
		# 	'imagesrc': 'image-editor.jpg',
		# 	'description': 'A neat little image editor that has many effects. Press \'c\' to enter commands.',
		# },	{
			'name': 'Grapher',
			'imagesrc': 'grapher.gif',
			'description': 'A function grapher with a neat tracing and newtons\' method (click \'n\' in trace mode).',
		},	{
			'name': 'Happy Number Calculator',
			'imagesrc': 'happy-number.png',
			'description': 'A <a class="animated" href="https://en.wikipedia.org/wiki/Happy_number">Happy Number</a> calculator.',
		},	{
			'name': 'Text Reverser',
			'imagesrc': '4600275420_c7bfb8466d.jpg',
			'description': 'Reverse the last two characters of words :P',
		},	{
			'name': 'Password Generator',
			'imagesrc': 'password.jpg',
			'description': 'Generate random passwords quickly!',
		},
	],
}

projects = [
	games,
	tools,
]