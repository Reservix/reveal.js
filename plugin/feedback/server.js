var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io');
io = io.listen(server);
var crypto = require('crypto');

var options = {
    port: 3000
};

var clients = {};
var answers = [];

server.listen(options.port);

io.sockets.on('connection', function (socket) {
    socket.on('slidechanged', function (slideData) {

        console.log('MY IP: --.----..,.>' + socket.handshake.address.address);


        var answerSession = crypto.createHash('md5').update(slideData.feedback).digest("hex");
        var userSession = crypto.createHash('md5').update(socket.handshake.address.address).digest("hex");

        slideData.answerSession = answerSession;
        slideData.userSession = userSession;
        socket.broadcast.emit('slidedata', slideData);

        console.log('slidechnage chought');
    });
});


// handle incoming connections from clients
io.sockets.on('connection', function (socket) {
    var address = socket.handshake.address;
    console.log("New connection from " + address.address + ":" + address.port);
    var userSession = crypto.createHash('md5').update(socket.handshake.address.address).digest("hex");
    socket.join(userSession);
    socket.username = userSession;
    clients[address.address] = socket.id;


    console.log('joined: ' + address.address);
    console.log('id:' + socket.id);
    console.log('userSession:' + userSession);

});

io.sockets.on('disconnect', function (socket) {
    var address = socket.handshake.address;
    console.log("New disconnect from " + address.address + ":" + address.port);
    //clients.push(address.address);

});

// Redirect static content
[ 'css', 'js', 'images', 'plugin', 'lib' ].forEach(function (dir) {
    app.use('/' + dir, express.static(__dirname + '/../../' + dir));
});

app.get('/master', function (req, res) {
    res.sendfile('index.html', {root: __dirname + '/../../'})
});

app.get('/', function (req, res) {
    res.sendfile('client.html', {root: __dirname});


    var clients = io.sockets.clients();

    for (var id in clients) {
        console.log(clients[id].manager.rooms);
        // res.push(io.sockets.adapter.nsp.connected[id]);
    }
    //console.log(  clients);

});

app.get('/answer/:answerSession/:userSession/:answerId', function (req, res) {
    var ip = req.param('userSession');
    console.log(ip);
    res.send(ip);

   // answers[],[],[];

//.push([req.param('answer')])

    var answerSession = [req.param('answerSession')];
    var answerId = [req.param('answerId')];
    //var userSession = req.param('userSession');
    var userSession = req.connection.remoteAddress;

    answerId.push(userSession);
    answerSession.push(answerId);

    answers.push(answerSession);
    console.log(answers);

});

console.log('Starting server on http://localhost:3000');


