import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import { createDeck } from './CardFactory.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

let messages = [];
let players = [];
let turns = [];
let direction = 1; //? 1 -> o -1 <- 
let turnIndex = 0;
let deck = [];
let discardDeck = [];

function nextTurn(changeDirection = false) {
  if(changeDirection){
    direction = direction * -1;
  }
  turns[turnIndex] = false;
  turnIndex = (turnIndex + direction + players.length) % players.length;
  turns[turnIndex] = true;
}

function first() {
  if(players.length > 1){
    let first = Math.floor(Math.random() * players.length);
    turnIndex = first;
    turns[turnIndex] = true;
  }
}

io.on('connection', (socket) => {
  console.log(`${socket.id} connected`);
  messages.forEach((msg) => {
    socket.emit('chat message', msg);
  })
  players.push({
    "socket":socket,
    "id": socket.id,
    "hand": []
  });
  turns.push(false);
  let toSend = {
    "list": players.map(player => player.socket.id),
    "turns": turns
  }
  io.emit('list', toSend)
  // TODO eliminar
  if(players.length === 1){
    turns[0] = true
  }
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    console.log(msg)
    if(msg.player === players[turnIndex].id){
      console.log(`${msg.text} ${msg.color}`);
      io.emit('chat message', `${msg.text}`);
      messages.push(msg.text);
      // TODO eliminar
      let turn = msg.text === 'change'
      nextTurn(turn);
    }
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});

deck = createDeck(0.8, false);
console.log(deck);