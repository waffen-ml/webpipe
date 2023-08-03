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
    queue[i] = undefined;
}

function sendData(i, data) {
    if (!queue[i]) return;
    const obj = queue[i];
    clearTimeout(obj.timeout);
    obj.res.send(data);
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
    console.log('Backend has connected.');

    if (backend) {
        console.log('Connection lost.');
        socket.disconnect();
    }

    socket.on('message', (msg) => {
        sendData(msg.id, msg.data);
    });

    socket.on('debug', (msg) => {
        console.log(msg);
    })

    backend = socket;
});

io.on('disconnect', socket => {
    if (socket != backend) return;
    backend = null;
    console.log('Backend has disconnected.');
})


server.listen(443, () => {
    console.log('listening on *:443');
});