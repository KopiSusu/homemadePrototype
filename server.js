var express = require('express'),
    app = express();

app.use(express.static(__dirname + '/'));

var server = require('http').Server(app);

server.listen(80);

