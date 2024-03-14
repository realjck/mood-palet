import sqlite3
from flask import Flask, render_template, request, session, redirect, url_for, g
from markupsafe import escape
from pathlib import Path

app = Flask(__name__)


##########################
# SQLite database
##########################

DATABASE = '.sqlite.db'

# Get database connexion
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        # Use Row objects instead of Dictionnaries for results:
        db.row_factory = sqlite3.Row
    return db

# Close connection at the end of each HTTP request
@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

# Init database, create from schema.sql if needed
def init_db():
    if not Path('.sqlite.db').exists():
        with app.app_context():
            db = get_db()
            with app.open_resource('schema.sql', mode='r') as f:
                db.cursor().executescript(f.read())
            db.commit()

# Créer un curseur :
# cur = get_db().cursor()

##########################
# Routes Flask
##########################

app.secret_key = b'a449a3e361391583a64fc758349592acebf6a5e801902686704c6a179e35c64b'

@app.route('/')
def index():
    if 'username' in session:
        return f'Logged in as {escape(session["username"])}'
    return 'You are not logged in'

@app.get('/login')
def login_get():
    get_db()
    init_db()
    return render_template('login.html')

@app.post('/login')
def login_post():
    username = request.form.get('username')
    return render_template('manager.html', name=username)

@app.route('/logout')
def logout():
    # remove the username from the session if it's there
    session.pop('username', None)
    return redirect(url_for('index'))
