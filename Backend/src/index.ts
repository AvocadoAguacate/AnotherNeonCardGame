import { Message } from './interfaces/message.model';
import express from 'express'
import { createServer } from 'node:http';
import { Server, Socket } from 'socket.io';
import { Game } from './Game';


const app = express()
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

let sockets: Socket[] = [];
let game: Game = new Game();

io.on('connection', (socket) => {
  sockets.push(socket);
  console.log(`Acaba de conectarse ${socket.id}`);
});

io.on('connection', (socket) => {
  socket.on('message', (msg: Message) => {
    console.log(`${msg.id} quiere ejecutar ${msg.type}`);
    const socket = sockets.find(s => s.id === msg.id);
    if (socket){
      console.log(msg);
      game.execute({...msg, socket});
    }
  })
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});