from flask import Flask, render_template, jsonify
from stock_scraper import get_data
import json
import pandas as pd
app = Flask(__name__)


@app.route("/")
def hello():
    return render_template("index.html")

@app.route("/data")
def data():

    with open('data1000.json') as file:
        json_data = json.load(file)
    return jsonify(json_data)


if __name__ == "__main__":

    app.run(debug=True)
