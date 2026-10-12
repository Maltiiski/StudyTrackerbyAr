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

def addorupd (subj, inc=1):
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, "w") as f:
            json.dump({}, f)

    with open(DATA_FILE, "r") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            data = {}

    if subj in data:
        data[subj]["elap"] += inc
    else:
        data[subj] = {"elap": inc}

    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=4)

    return data

@app.route("/add-subject", methods=["POST"])
def handleaddsubj():
    req_data = request.get_json()
    subj = req_data.get("subject")

    if not subj:
        return jsonify({"error": "mana nama subj"}), 400

    updata = addorupd(subj)
    return jsonify({"status": "success", "data": updata})

@app.route("/get-subjects", methods=["GET"])
def getsubj():
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, "w") as f:
            json.dump({}, f)

    with open(DATA_FILE, "r") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            data = {}

    return jsonify(data), 200

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)