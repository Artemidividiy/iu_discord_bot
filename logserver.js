const express = require('express');
const fs = require('fs');
const app = express();
const { exec, spawn } = require("child_process");

function log(data) {
    console.log('[' + (new Date(Date.now())).toLocaleDateString() + ' ' + (new Date(Date.now())).toLocaleTimeString() + '] (server) >' + data + '\n');
};

app.get('/log', function (req, res) {
    let webpage = '<!DOCTYPE html> <head> <title>Logs</title> </head> <body> ';
    fs.readFile('clog.txt', 'utf8', function (err, data) {
        if (err) {
          return log(err);
        }
        data.split('\n').forEach(line => {
            webpage += line + ' <br> ';
        });
        res.send(webpage);
    });
})

app.get('/clear', function (req, res) {
    fs.writeFile('logs.txt', '', function (err, data) {
        if (err) {
          return log(err);
        }
        res.send('logs cleared');
    });
})

app.get('/deploy', function (req, res) {
    log('new version deployed');
    exec("git pull origin master", (error, stdout, stderr) => {
        if (error) {
            log(`${error.message}`);
            return;
        }
        if (stderr) {
            log(`${stderr}`);
            return;
        }
        log(`${stdout}`);
    });
    res.send('deploy request recieved');
})

app.get('/physdiary', function(req, res) {
    log('query on physdiary');
    app.get("/physdiary", (req, res) => {
        var dts;
        var args = msg.content.split(" ");
        const python = spawn("python", ["__main__.py"]);
        for (let i = 0; i < 9; i++) {python.stdin.write(args[i]);}
        python.stdout.on("data", (data) => {
          console.log("we got the result");
          dts = data;
        });
        python.on('close', (code) => {
          console.log(`child process close all stdio with code ${code}`);
      });
      res.send(dts);
  })

app.listen(80);