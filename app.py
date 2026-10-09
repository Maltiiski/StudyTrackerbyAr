import json
import os
from flask import Flask, jsonify, render_template, request

try:
    from flask_cors import CORS
except ImportError:
    def CORS(app=None, *args, **kwargs):
        if app is None:
            def decorator(func):
                return func
            return decorator
        return app

app = Flask(__name__)
CORS(app)

DATA_FILE = "sessions.json"

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)