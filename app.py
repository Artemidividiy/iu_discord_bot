from flask import Flask, jsonify
app = Flask(__name__)

@app.route('/')
def mainpg():
    f = open('log.txt', 'r')
    a = {str(i) : f.readline() for i in f}
    return a 