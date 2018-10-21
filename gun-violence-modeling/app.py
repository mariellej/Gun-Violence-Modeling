from flask import Flask, render_template, jsonify
from stock_scraper import get_data
import json
import pandas as pd
app = Flask(__name__)


@app.route("/")
def hello():
    return render_template("index.html")

@app.route("/incident_data")
def incident_data():

    with open('data1000.json') as file:
        json_data = json.load(file)
    return jsonify(json_data)

@app.route("/us_states")
def us_data():
    with open('us-states.json') as us_file:
        us_json_data = json.load(us_file)
    return jsonify(us_json_data)


if __name__ == "__main__":
    app.run(debug=True)
