const express = require('express');
const fs = require('fs');
const app = express();

fs.unlink('log.txt', (err) => {
    if(err) {
        throw err;
    }
    console.log('Logs cleared');
});

app.get('/', function (req, res) {
    let webpage = '<!DOCTYPE html> <head> <title>Logs</title> </head> <body> ';
    fs.readFile('log.txt', 'utf-8', function (err, data) {
        if (err) {
          return console.log(err);
        }
        data.split('\n').forEach(line => {
            webpage += line + ' <br> ';
        });
        res.send(webpage);
    });
})

app.listen(process.env.PORT);