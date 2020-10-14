from flask import Flask
app = Flask(__name__)

@app.route('/main/')
def mainpg():
    f = open('log.txt', 'r')
    a = {str(i) : 0 for i in f}
    return a 

if __name__ == '__main__' : app.run(threaded=True)