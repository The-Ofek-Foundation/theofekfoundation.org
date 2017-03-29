# Ofek Gila's Official Website

### What it is
https://www.theofekfoundation.org is my personal website with plenty games (most of which with super strong AIs) and some neat tools as well.

### What this repository is
I wholeheartedly believe in open-sourcing code, so the code for my website is and will always be public. Feel free to fork some of my projects and improve them!

### How to get started (for Ubuntu/Linux Mint)

#### Step 1: Install dependencies

1. Python 2.7.*, pip
2. django (1.10.*), minidetector, and jsonfield with pip

	```bash
	sudo pip install django
	sudo pip install minidetector
	sudo pip install jsonfield
	```

#### Step 2: Setup repository

1. Clone the repository from [here][repo url] recursively, e.g.:

	```bash
	git clone https://github.com/The-Ofek-Foundation/theofekfoundation.org.git --recursive
	```

2. Run migrations and populate pages

	```bash
	python manage.py migrate
	python populate_pages.py
	```


[repo url]:https://github.com/The-Ofek-Foundation/theofekfoundation.org "github repository"
