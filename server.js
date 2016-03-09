var express = require('express');
var app = express();

app.use(express.static(__dirname + '/'));

app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('index.html', { root: __dirname });
});

app.listen(8080); //the port you want to use