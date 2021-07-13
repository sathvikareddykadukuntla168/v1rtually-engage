const path = require('path');
const express = require('express')
const http = require('http')
const moment = require('moment');
const socketio = require('socket.io');
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

const io = socketio(server);

app.use(express.static(path.join(__dirname, 'FRONTEND')));

let rooms = {}; // all the rooms 
let socketroom = {}; // room that each socket belongs to 
let socketname = {}; // name of the socket
let micSocket = {}; // mic of the socket if on ot not
let videoSocket = {}; // video of the socket if on ot not
let roomBoard = {}; // collaborative board of room

io.on('connect', socket => {

    // Joining room Request to be served
    // add data into data lists and emit sockets back to rooms
    socket.on("join room", (roomid, username) => {

        socket.join(roomid);
        socketroom[socket.id] = roomid;
        socketname[socket.id] = username;
        micSocket[socket.id] = 'on';
        videoSocket[socket.id] = 'on';

        if (rooms[roomid] && rooms[roomid].length > 0) {
            rooms[roomid].push(socket.id);
            socket.to(roomid).emit('message', `${username} joined the room.`, 'Bot', moment().format(
                "h:mm a"
            ));
            io.to(socket.id).emit('join room', rooms[roomid].filter(pid => pid != socket.id), socketname, micSocket, videoSocket);
        }
        else {
            rooms[roomid] = [socket.id];
            io.to(socket.id).emit('join room', null, null, null, null);
        }

        io.to(roomid).emit('user count', rooms[roomid].length);

    });

    // actions performed by individual sockets on mic or video served
    socket.on('action', msg => {
        if (msg == 'mute'){
            micSocket[socket.id] = 'off';
        }
        else if (msg == 'unmute'){
            micSocket[socket.id] = 'on';
        }
        else if (msg == 'videoon'){
            videoSocket[socket.id] = 'on';
        }
        else if (msg == 'videooff'){
            videoSocket[socket.id] = 'off';
        }

        socket.to(socketroom[socket.id]).emit('action', msg, socket.id);
    })

    // to check on video offer from the socket 
    socket.on('video-offer', (offer, sid) => {
        socket.to(sid).emit('video-offer', offer, socket.id, socketname[socket.id], micSocket[socket.id], videoSocket[socket.id]);
    })

    // to check on Video answered or not
    socket.on('video-answer', (answer, sid) => {
        socket.to(sid).emit('video-answer', answer, socket.id);
    })

    // ICE candidate to know the internet status of peer
    socket.on('new icecandidate', (candidate, sid) => {
        socket.to(sid).emit('new icecandidate', candidate, socket.id);
    })

    //  message request to be published on chat
    socket.on('message', (msg, username, roomid) => {
        io.to(roomid).emit('message', msg, username, moment().format(
            "h:mm a"
        ));
    })

    // to return list of attendies and number of attendies
    socket.on('attendies',(roomid)=>{

        var attendiesofRoom = new String("");
        let attendieslist=[];
         let socketidsofroom=rooms[roomid];
         for(var socketid in socketidsofroom){
            attendieslist.push(socketname[socketidsofroom[socketid]]);
            attendiesofRoom+=socketname[socketidsofroom[socketid]]+"\n";
         }
         io.to(roomid).emit('attendies',attendieslist);
    });

    // request to give new canvas when requested
    socket.on('getCanvas', () => {
        if (roomBoard[socketroom[socket.id]])
            socket.emit('getCanvas', roomBoard[socketroom[socket.id]]);
    });

    // to make interactive white board directing draw from socket to board
    socket.on('draw', (newx, newy, prevx, prevy, color, size) => {
        socket.to(socketroom[socket.id]).emit('draw', newx, newy, prevx, prevy, color, size);
    })

    // to make interactive white board directing clear from socket to board
    socket.on('clearBoard', () => {
        socket.to(socketroom[socket.id]).emit('clearBoard');
    });

    // to store the canvas
    socket.on('store canvas', url => {
        roomBoard[socketroom[socket.id]] = url;
    });

    // when leaving call recheck if room has this id again or not
    socket.on('disconnect', () => {
        if (!socketroom[socket.id]) return;
        socket.to(socketroom[socket.id]).emit('message', `${socketname[socket.id]} left the chat.`, `Bot`, moment().format(
            "h:mm a"
        ));
        socket.to(socketroom[socket.id]).emit('remove peer', socket.id);
        var index = rooms[socketroom[socket.id]].indexOf(socket.id);
        rooms[socketroom[socket.id]].splice(index, 1);
        io.to(socketroom[socket.id]).emit('user count', rooms[socketroom[socket.id]].length);
        delete socketroom[socket.id];
        // check if user out or not
        console.log('--------------------');
        console.log(rooms[socketroom[socket.id]]);

        //toDo: push socket.id out of rooms
    });

})

server.listen(PORT, () => console.log(`Server is up and running on port ${PORT}`));