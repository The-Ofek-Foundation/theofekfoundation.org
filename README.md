# Ofek Gila's Official Website

### What it is
(https://www.theofekfoundation.org) is my personal website with plenty games (most of which with super strong AIs) and some neat tools as well.

### What this repository is
I wholeheartedly believe in open-sourcing code, so the code for my website is and will always be public. Feel free to fork some of my projects and improve them (each game/tool is in its own submodule)!

### How to get started (for Ubuntu/Linux Mint)

#### Step 1: Install dependencies

1. Python 2.7.*, setuptools, pip
2. django (1.11.*), minidetector, jsonfield, and social-aut-app-django with pip

	```bash
	sudo pip install django
	sudo pip install minidetector
	sudo pip install jsonfield
	sudo pip install social-auth-app-django
	```

#### Step 2: Setup repository

1. Clone the repository from [here][repo url] recursively, e.g.:

	```bash
	git clone https://github.com/The-Ofek-Foundation/theofekfoundation.org.git --recursive
	```

If you forgot to clone recursively, you can pull submodules like so:

```bash
git submodule init
git submodule update --recursive
```

2. Run migrations and populate pages

	```bash
	python manage.py migrate
	python populate_pages.py
	```

#### Step 3: Setup local settings

1. Copy barebone settings from barebones_local_settings.py

	```bash
	cp TheOfekFoundation/barebones_local_settings.py TheOfekFoundation/local_settings.py
	```

2. **Optional:** Override email settings with your own testing email account (only necessary if testing forgot password feature)

#### And that's it!

Start running with:

```bash
python manage.py runserver
```

Note that if you are testing with DEBUG = False (e.g. when testing out the 404 error page), be sure to run with the --insecure parameter, e.g.:

```bash
python manage.py runserver --insecure
```

If you want to edit stylesheets, be sure to edit the **.less** files and not the **.css** files. LESS files compile into CSS. The syntax is pretty similar, but a bit more intuitive in my opinion. In order to compile the LESS files, install *lessc* using:

```bash
sudo apt-get install node-less
```

and then run:

```bash
bash lessc
# or ./lessc
```

Also if you add a new LESS file, be sure to update it in the lessc file by mimicking the other lines.



And view the website live [here](http://127.0.0.1:8000/) or [here](http://localhost:8000/)!

[repo url]:https://github.com/The-Ofek-Foundation/theofekfoundation.org "github repository"
