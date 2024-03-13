from flask import Flask, url_for

app = Flask(__name__)

@app.route("/")
def hello_world():
    return f"<h1>Hello, World!</h1><p>Route: {url_for('hello_world')}</p>"
