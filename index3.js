const express = require('express');
const app = express();
const server = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.send({text: 'хуй, запрос'}); 
});

io.on('connection', socket => {
    socket.on('message', data => {
        console.log(data);
        socket.emit('message', {text: 'ХУУЙЙЙ'});
    });
})

server.listen(443, () => {
    console.log('listening on *:443');
});