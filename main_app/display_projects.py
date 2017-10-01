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
			'display_main': True,
			'mobile_friendly': True,
		},	{
			'name': 'Ultimate Tic Tac Toe',
			'imagesrc': 'Ultimate-Tic-Tac-Toe.jpg',
			'description': 'An AI I literally whipped over two nights—the interface is slightly lacking—but plays well nonetheless.',
			'template': 'games/UltimateTicTacToeDescription.html',
			'save': True,
			'display_main': True,
			'mobile_friendly': True,
		},	{
			'name': 'Old Snakey',
			'imagesrc': 'snakey_level_1.gif',
			'description': 'The good old retro game of Old Snakey, coded with multiple AIs (that you can simultaneously play against!)',
			'template': 'games/OldSnakeyDescription.html',
			'save': True,
			'display_main': True,
			'mobile_friendly': False,
		},	{
			'name': 'Weiqi',
			'imagesrc': 'board-game-go.jpg',
			'description': 'Play Go, Gomoku, or Wu. The only one with an AI—however—is Gomoku—with a Minimax implementation.',
			'template': 'games/WeiqiDescription.html',
			'save': False,
			'display_main': False,
			'mobile_friendly': True,
		},	{
			'name': 'Mancala',
			'imagesrc': 'mancala.JPG',
			'description': 'My first Monte Carlo tree search AI! The game itself is programmed with a customizable set of rules.',
			'template': 'games/MancalaDescription.html',
			'save': True,
			'display_main': True,
			'mobile_friendly': True,
		},	{
			'name': 'Lame Duck',
			'imagesrc': 'duck.svg',
			'description': 'This game precedes this website by half a year, and was made in a few hours. It seems to be the largest attraction of my site for some reason.',
			'template': 'games/LameDuckDescription.html',
			'save': False,
			'display_main': True,
			'mobile_friendly': False,
		},	{
			'name': 'Minesweeper',
			'description': "Simple Minesweeper with multiple difficulties!",
			'template': 'games/MinesweeperDescription.html',
			'save': True,
			'display_main': False,
			'mobile_friendly': True,
		},	{
			'name': u'מפגשים צולבים',
			'description': "Play the Israeli מפגשים צולבים game online against an AI!",
			'template': 'games/CrossroadsDescription.html',
			'save': True,
			'display_main': False,
			'mobile_friendly': True,
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
			'display_main': True,
			'mobile_friendly': True,
		},	{
			'name': 'Prime Factorizer',
			'imagesrc': 'factor-tree.gif',
			'description': 'A super-fast prime number factorizer that uses a sieve of a size that you get to input!',
			'display_main': True,
			'mobile_friendly': True,
		},	{
		# 	'name': 'Image Editor',
		# 	'imagesrc': 'image-editor.jpg',
		# 	'description': 'A neat little image editor that has many effects. Press \'c\' to enter commands.',
		# },	{
			'name': 'Grapher',
			'imagesrc': 'grapher.gif',
			'description': 'A function grapher with a neat tracing and newtons\' method (click \'n\' in trace mode).',
			'display_main': True,
			'mobile_friendly': True,
		},	{
			'name': 'Happy Number Calculator',
			'imagesrc': 'happy-number.png',
			'description': 'A <a class="animated" href="https://en.wikipedia.org/wiki/Happy_number">Happy Number</a> calculator.',
			'display_main': True,
			'mobile_friendly': True,
		},	{
			'name': 'Text Reverser',
			'imagesrc': '4600275420_c7bfb8466d.jpg',
			'description': 'Reverse the last two characters of words :P',
			'display_main': True,
			'mobile_friendly': True,
		},	{
			'name': 'Password Generator',
			'imagesrc': 'password.jpg',
			'description': 'Generate random passwords quickly!',
			'display_main': True,
			'mobile_friendly': True,
		},
	],
}

projects = [
	games,
	tools,
]