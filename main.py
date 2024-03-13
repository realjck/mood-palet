from flask import Flask, render_template, request, session, redirect, url_for
from markupsafe import escape

app = Flask(__name__)

app.secret_key = b'a449a3e361391583a64fc758349592acebf6a5e801902686704c6a179e35c64b'

@app.route('/')
def index():
    if 'username' in session:
        return f'Logged in as {session["username"]}'
    return 'You are not logged in'

@app.get('/login')
def login_get():
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
