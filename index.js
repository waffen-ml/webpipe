const express = require('express');
const app = express();
const server = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const timeout = 5 * 1000;
let backend = null;
let queue = {};
let i = 0;

function addToQueue(res) {
    let obj = {id: i++, res: res};
    obj.timeout = setTimeout(() => sendEmpty(obj.id), timeout);
    queue[obj.id] = obj;
    return obj.id;
}

function removeFromQueue(i) {
    const obj = queue[i];
    if (obj) clearTimeout(obj.timeout);
    delete queue[i];
}

function sendData(i, data) {
    if (!queue[i]) return;
    queue[i].res.send(data);
    removeFromQueue(i);
}

function sendEmpty(i) {
    sendData(i, {});
}

app.get('/', (req, res) => {
    res.send('hello world!');
})

app.get('/access', (req, res) => {
    const data = req.query;
    console.log('New request!');

    if(!backend) {
        res.send({});
        return;
    }

    const id = addToQueue(res);
    backend.send({id: id, data: data});
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
        console.log('Sending data...')
        sendData(msg.id, msg.data);
    });

    socket.on('test', (msg) => {
        console.log('test msg:');
        console.log(msg);
    });

    console.log('Backend was attached!');

    backend = socket;
});

io.on('disconnect', dSocket => {
    if (!backend || dSocket.id != backend.id) return;
    console.log('Backend has disconnected');
    backend = null;
})

server.listen(443, () => {
    console.log('listening on *:443');
});