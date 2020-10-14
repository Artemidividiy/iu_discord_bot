const express = require('express');
const fs = require('fs');
const app = express();
const { exec } = require("child_process");

exec("git pull origin master", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
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
    exec("git pull origin master", (error, stdout, stderr) => {
        if (error) {
            console.log(`${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`${stderr}`);
            return;
        }
        console.log(`${stdout}`);
    });
    res.send('deployed');
})

app.listen(8080);