const express = require('express');
const fs = require('fs');
const app = express();
const { exec } = require("child_process");

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

app.listen(80);