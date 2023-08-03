const { Server } = require("socket.io");
const io = new Server(443);


io.on('connection', socket => {
    socket.on('message', data => {
        console.log(data);
        socket.emit('message', {text: 'ХУУЙЙЙ'});
    });
})