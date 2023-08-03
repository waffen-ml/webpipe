const express = require('express');
const app = express();
const server = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let backend = null;

app.get('/', (req, res) => {
    res.send('hello world!');
})

app.get('/access', (req, res) => {
    const data = req.query;
    console.log('New request!');
    console.log(data);

    if(!backend) {
        res.send({});
        return;
    }

    res.send(data);
    backend.emit('message', data);
});


io.on('connection', socket => {
    console.log('A new connection!');

    if (backend) {
        console.log('Backend has already connected.');
        console.log('Disconnecting.');
        socket.disconnect();
        return;
    }

    socket.on('message', (msg) => {
        //sendData(msg.id, msg.data);
        console.log('msg');
        console.log(msg);
    });

    socket.on('test', (msg) => {
        console.log('test msg:');
        console.log(msg);
    });

    socket.on('disconnect', () => {
        console.log('Backend has disconnected');
        backend = null;
    }) 

    backend = socket;
});


server.listen(443, () => {
    console.log('listening on *:443');
});