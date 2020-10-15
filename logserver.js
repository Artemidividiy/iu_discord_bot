const express = require('express');
const fs = require('fs');
const app = express();
const { exec } = require("child_process");

function log(data) {
    fs.appendFile('logs.txt', '[' + (new Date(Date.now())).toLocaleDateString() + ' ' + (new Date(Date.now())).toLocaleTimeString() + '] ' + data + '\n', function (err) {
        if (err) throw err;
    });
};

app.get('/log', function (req, res) {
    let webpage = '<!DOCTYPE html> <head> <title>Logs</title> </head> <body> ';
    fs.readFile('logs.txt', 'utf8', function (err, data) {
        if (err) {
          return console.log(err);
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
          return console.log(err);
        }
        res.send('logs cleared');
    });
})

app.get('/deploy', function (req, res) {
    exec("git pull origin master", (error, stdout, stderr) => {
        if (error) {
            console.log(`${error.message}`);
            return;
        }
        log('new version deployed');
        if (stderr) {
            console.log(`${stderr}`);
            return;
        }
        console.log(`${stdout}`);
    });
    res.send('deploy request recieved');
})

app.listen(80);