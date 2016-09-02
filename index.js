PORT = process.env.PORT || 80;
const app = require('express')();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
// socket io
const io = require('socket.io')(http);
const chat = io.of('/chat');

app.use(bodyParser.urlencoded({ extended: false }));

// on connection
chat.on('connection', socket => {
    console.log('a user connected', socket.id);

    // upon connection, matched user joins a room
    socket.on('subscribe', (room) => {
        console.log('joined room: ', room);
        socket.join(room);
    });

    // emits message to room users
    socket.on('message', message => {
        console.log('body:', message);
        socket.broadcast.to(message.room).emit('message', message);
    });

    // disconnected
    socket.on('disconnect', () => {
        console.log('user disconnected')
    });
});

http.listen(PORT, function() {
    console.log("listening on...", PORT)
});
