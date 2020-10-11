from flask import Flask, jsonify
app = Flask(__name__)

@app.route('/')
def mainpg():
    f = open('log.txt', 'r')
    a = {str(i) : 0 for i in f}
    return a 