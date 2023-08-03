const io = require('socket.io-client');
const socket = io('http://localhost:443');


socket.on('message', data => {
    console.log(data);
})

socket.emit('message', {text: 'хууйй'});