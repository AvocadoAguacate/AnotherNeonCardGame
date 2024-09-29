import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import {addPlayer, addIO, playerReady, playTurn, voteDeck, playChallenge} from './Game.js'
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});
addIO(io);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

let sockets = [];

io.on('connection', (socket) => {
  sockets.push(socket);
});

io.on('connection', (socket) => {
  socket.on('setPlayer', msg => {
    console.log(msg); 
    addPlayer(msg);
  })
});

io.on('connection', (socket) => {
  socket.on('challenge', (msg) => {
    console.log(msg);
    playChallenge(msg);
  });
});

io.on('connection', (socket) => {
  socket.on('voteDeck', (msg) => {
    console.log(msg);
    voteDeck(msg);
  });
});

io.on('connection', (socket) => {
  socket.on('ready', (msg) => {
    console.log(msg);
    playerReady(msg);
  });
}); 

io.on('connection', (socket) => {
  socket.on('playTurn', (msg) => {
    console.log(msg);
    playTurn(msg);
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});