# Ofek Gila's Official Website

### What it is
(https://www.theofekfoundation.org) is my personal website with plenty games (most of which with super strong AIs) and some neat tools as well.

### What this repository is
I wholeheartedly believe in open-sourcing code, so the code for my website is and will always be public. Feel free to fork some of my projects and improve them (each game/tool is in its own submodule)!

### How it works

The site is a **static site on [Firebase Hosting](https://firebase.google.com/docs/hosting)**. Django is only used as a build tool: it renders every page to `public/`.

- **Accounts** use Firebase Authentication (email/password, Google, GitHub) in the browser. Signed-in users' game settings sync to Firestore (`static/assets/javascript/firebase_auth.js`, rules in `firestore.rules`). Everyone's settings are also saved in the browser.
- **Hangman's challenge mode** is a small Python Cloud Function (`functions/`), served at `/games/api/get_hangman_word/`.
- Redirects, rewrites and cache headers live in `firebase.json`.

### How to get started (for Ubuntu/Linux Mint)

#### Step 1: Clone the repository recursively

```bash
git clone https://github.com/The-Ofek-Foundation/theofekfoundation.org.git --recursive
```

If you forgot to clone recursively, you can pull submodules like so:

```bash
git submodule init
git submodule update --recursive
```

#### Step 2: Install dependencies (Python 3.12)

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
```

#### Step 3: Run it locally

```bash
.venv/bin/python manage.py runserver
```

And view the website [here](http://127.0.0.1:8000/)! (Sign-in only works on the deployed domains.)

To build the static site exactly as it's deployed:

```bash
.venv/bin/python manage.py build_static    # writes public/
python3 -m http.server -d public 8000
```

### Deploying

Uses the [Firebase CLI](https://firebase.google.com/docs/cli) (`npx -y firebase-tools@latest`). The hosting deploy runs `build_static` automatically.

```bash
npx -y firebase-tools@latest hosting:channel:deploy preview   # private preview URL
npx -y firebase-tools@latest deploy --only hosting            # the live site
npx -y firebase-tools@latest deploy --only firestore:rules
```

The Hangman function needs its own virtualenv before deploying:

```bash
python3.12 -m venv functions/venv
functions/venv/bin/pip install -r functions/requirements.txt
(cd functions && venv/bin/python -m unittest test_hangman)
npx -y firebase-tools@latest deploy --only functions
```

### Stylesheets

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

[repo url]:https://github.com/The-Ofek-Foundation/theofekfoundation.org "github repository"
