const express = require('express');
const fs = require('fs');
const app = express();
const exec = require('child_process').exec, child;

deploy = exec('git pull origin master',
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
             console.log('exec error: ' + error);
        }
});


app.get('/log', function (req, res) {
    let webpage = '<!DOCTYPE html> <head> <title>Logs</title> </head> <body> ';
    fs.readFile('logs.txt', 'utf-8', function (err, data) {
        if (err) {
          return console.log(err);
        }
        data.split('\n').forEach(line => {
            webpage += line + ' <br> ';
        });
        res.send(webpage);
    });
})

app.get('/deploy', function (req, res) {
    deploy();
})

app.listen(process.env.PORT);