import sqlite3
from flask import Flask, render_template, request, session, redirect, url_for, g
from markupsafe import escape
from pathlib import Path
from werkzeug.security import generate_password_hash

app = Flask(__name__)


##########################
# SQLite database
##########################

DATABASE = '.sqlite.db'

def get_db():
    """Get database connexion"""
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        # Use Row objects instead of Dictionnaries for results:
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    """Close connection at the end of each HTTP request"""
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    """Init database, create from schema.sql if needed"""
    if not Path('.sqlite.db').exists():
        with app.app_context():
            db = get_db()
            with app.open_resource('schema.sql', mode='r') as f:
                db.cursor().executescript(f.read())
            db.commit()

##########################
# Routes Flask WEB
##########################

app.secret_key = b'a449a3e361391583a64fc758349592acebf6a5e801902686704c6a179e35c64b'

@app.route('/')
def index():
    """Main route /"""
    if 'username' in session:
        return f'Logged as {session["username"]}'
    else:
        return redirect(url_for('login_get'))

@app.get('/signup')
def signup_get():
    """Show sign-up screen"""
    return render_template('signup.html')

@app.post('/signup')
def signup_post():
    """do sign-up"""
    username = escape(request.form.get('username')).strip()
    password = escape(request.form.get('password')).strip()

    if (len(username) < 4) or (len(password) < 4):
        return render_template('signup.html',
                               message_alert="Username or password too short")

    db = get_db()

    cursor = db.cursor()
    cursor.execute("SELECT * FROM user WHERE name=?",
                   (username,))
    is_taken = cursor.fetchone()
    if is_taken:
        return render_template('signup.html',message_alert="Username already taken.")

    hashed_password = generate_password_hash(password)
    cursor.execute("INSERT INTO user (name, password) VALUES (?, ?)",
                   (username, hashed_password))
    db.commit()
    db.close()

    return render_template('login.html',
                           message_info="Username "+username+" created with success.")

@app.get('/login')
def login_get():
    """Show login screen"""
    return render_template('login.html')

@app.post('/login')
def login_post():
    """do login"""
    init_db()
    name = generate_password_hash(escape(request.form.get('username')))
    return render_template('manager.html', name=name)

@app.route('/logout')
def logout():
    # remove the username from the session if it's there
    session.pop('username', None)
    return redirect(url_for('index'))
