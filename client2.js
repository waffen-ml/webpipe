const io = require('socket.io-client');
const socket = io('https://web-pipe.onrender.com');


const sendMsg = () => socket.emit('message', {text: 'хууйй'});


socket.on('message', data => {
    console.log(data);
    setTimeout(sendMsg, 1000);
})

sendMsg();