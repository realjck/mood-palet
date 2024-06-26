import ast
import datetime
import os
import sqlite3
import uuid

from functools import wraps

from flask import Flask, render_template, request, session, redirect, url_for, g, flash, get_flashed_messages, abort, \
    jsonify, json
from markupsafe import escape
from pathlib import Path
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)


##########################
# SQLite database
##########################

DATABASE = 'MOOD_PALET.db'


def get_db():
    """Get database connexion"""
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        # Use Row objects instead of Dictionaries for results:
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
    if not Path('MOOD_PALET.db').exists():
        with app.app_context():
            db = get_db()
            # with app.open_resource('schema.sql', mode='r') as f:
            with open('schema.sql', 'r', encoding='utf-8') as f:
                db.cursor().executescript(f.read())
            db.commit()


def select_db(table, key, value, leave_open=False):
    """Do a SQL SELECT (often used to check if user exists)"""
    db = get_db()
    cursor = db.cursor()
    cursor.execute(f"SELECT * FROM {table} WHERE {key}=?", (value,))
    response = cursor.fetchall()
    response = [list(row) for row in response]
    cursor.close()
    if not leave_open:
        db.close()
    return response


##########################
# HTML WEB routes
##########################

app.secret_key = os.environ.get("SECRET_KEY")

@app.route('/')
def index():
    """Main route /"""
    if 'username' in session:
        return redirect(url_for('palets', username=session["username"]))
    else:
        init_db()
        return redirect(url_for('login'))


@app.errorhandler(404)
def page_not_found(error):
    """404 NOT FOUND"""
    return render_template("404.html"), 404


@app.route('/pp')
def doc_pp():
    """Privacy policy"""
    return render_template("doc_pp.html")


@app.route('/tou')
def doc_tou():
    """Terms of Use"""
    return render_template("doc_tou.html")


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    """Show sign-up screen / do sign-up"""

    if request.method == 'GET':
        return render_template('signup.html')

    if request.method == 'POST':
        username = escape(request.form.get('username')).strip()
        password = escape(request.form.get('password')).strip()

        if (len(username) < 4) or (len(password) < 4):
            return render_template('signup.html',
                                   message_alert="Username or password too short")

        is_taken = select_db('user', 'name', username, True)
        if len(is_taken) > 0:
            return render_template('signup.html',message_alert="Username already taken.")

        hashed_password = generate_password_hash(password)
        db = get_db()
        cursor = db.cursor()
        cursor.execute("INSERT INTO user (name, password) VALUES (?, ?)",
                       (username, hashed_password))
        db.commit()
        cursor.close()
        db.close()

        flash('Username {} created with success.'.format(username), 'info')
        return redirect(url_for('login'))


@app.route('/login', methods=['GET', 'POST'])
def login():
    """Show login screen / do login"""
    if request.method == 'GET':
        infos = get_flashed_messages(category_filter=['info'])
        message_info = ''
        if len(infos) > 0:
            message_info = infos[len(infos) - 1]
        return render_template('login.html', message_info=message_info)

    if request.method == 'POST':
        init_db()
        name = escape(request.form.get('username'))
        password = escape(request.form.get('password'))
        result = select_db('user','name', name)
        if len(result) > 0 and check_password_hash(result[0][2], password):
            session["user_id"] = result[0][0]
            session["username"] = name
            session["key"] = str(uuid.uuid4())
            return redirect(url_for('palets', username=name))
        return render_template('login.html', message_alert='Wrong username or password')


@app.route('/logout')
def logout():
    # remove the username from the session if it's there
    session.pop('username', None)
    return redirect(url_for('index'))


@app.route('/palets/<username>')
def palets(username):
    """Route for palets page of a user"""
    is_author = False
    if session.get('username'):
        is_author = username == session['username']

    result = select_db('user','name', username)
    if len(result) > 0:
        return render_template('palets.html', name=username, is_author=is_author)

    return render_template('404.html')


@app.route('/palet/<url>')
def palet(url):
    """Route for 1 palet (from 8 chars url)"""
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
            SELECT user.name, palet.id, palet.title, palet.colors
            FROM palet
            INNER JOIN user ON palet.user_id = user.id
            WHERE palet.url = ?
        """, (url,))

    palet = [dict(row) for row in cursor.fetchall()]
    cursor.close()
    db.close()
    if len(palet) > 0:
        id = palet[0]['id']
        name = palet[0]['name']
        title = palet[0]['title']
        cols = ast.literal_eval(palet[0]['colors'])
        is_author = False
        if session.get('username'):
            is_author = name == session['username']
        return render_template('palet.html', id=id, cols=cols, title=title, name=name, is_author=is_author)

    return render_template('404.html')


##########################
# REST routes for palets
##########################

def auth_required(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        if not request.headers.get('Authorization'):
            return abort(401)

        key = request.headers['Authorization'].split(' ')[1]

        if session['key'] != key:
            return abort(401)

        return func(*args, **kwargs)

    return decorated_function


@app.get('/palets/<username>/get')
def palets_get(username):
    """Get the palets from a user (public route)"""
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        SELECT p.id, p.date, p.title, p.colors, p.url
        FROM palet p
        INNER JOIN user u ON p.user_id = u.id
        WHERE u.name = ?
    """, (username,))

    palets = [dict(row) for row in cursor.fetchall()]
    cursor.close()
    db.close()

    return jsonify({"palets": palets})


@app.route('/palet/create', methods=['POST'])
@auth_required
def palet_create():
    """Create a palet entry"""
    response = request.get_json()
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO palet (user_id, date, title, colors, url)
        VALUES (?, ?, ?, ?, ?)
    """, (
        session['user_id'],
        datetime.datetime.now(),
        escape(response['title']),
        json.dumps(response['colors']),
        str(str(uuid.uuid4())[:8])
    ))
    cursor.close()
    db.commit()
    db.close()
    return jsonify({'success': session['user_id']})


@app.route('/palet/delete', methods=['POST'])
@auth_required
def palet_delete():
    """Delete a palet entry"""
    palet_id = str(request.get_json()['id'])

    if palet_id is None:
        return jsonify({"error": "Missing palet ID"}), 400

    db = get_db()
    cursor = db.cursor()

    # verify that entry belongs to user
    cursor.execute("""
        SELECT user.name
        FROM palet
        INNER JOIN user ON palet.user_id = user.id
        WHERE palet.id = ?
    """, (palet_id,))

    result = cursor.fetchone()
    if result is not None:
        if result[0] == session['username']:
            # do the delete
            cursor.execute("""
                DELETE FROM palet
                WHERE id = ?
            """, (palet_id,))

            cursor.close()
            db.commit()
            db.close()
            return jsonify({"success": True}), 200

    return jsonify({"error": "Unauthorized"}), 401


# RUN THE APP
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)
