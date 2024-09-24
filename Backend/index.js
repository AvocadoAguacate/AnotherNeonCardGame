import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import { createDeck, mixUpDeck } from './CardFactory.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

let messages = [];
let context = {
  "players": [],
  "turns": [],
  "direction": 1,
  "turnIndex":0,
  "deck": [],
  "discardDeck": []
}

function nextTurn(context) {
  let {turns, turnIndex, direction, players} = context;
  turns[turnIndex] = false;
  turnIndex = (turnIndex + direction + players.length) % players.length;
  turns[turnIndex] = true;
  return {...context, "turnIndex": turnIndex, "turns": turns}
}

function firstPlayer() {
  if(context.players.length > 1){
    let first = Math.floor(Math.random() * context.players.length);
    context.turnIndex = first;
    context.turns[turnIndex] = true;
  }
}

io.on('connection', (socket) => {
  console.log(`${socket.id} connected`);
  messages.forEach((msg) => {
    socket.emit('chat message', msg);
  })
  context = addPlayer(socket, context);
  socket.emit('hand', context.players[context.players.length - 1].hand);
  // TODO eliminar
  if(context.players.length === 1){
    context.turns[0] = true
    firstCard()
    io.emit('chat message', `${context.discardDeck[0].color} - ${context.discardDeck[0].number}`);
    messages.push(`${context.discardDeck[0].color} - ${context.discardDeck[0].number}`);
  }
});

function addPlayer(socket, context) {
  let {players, turns} = context;
  players.push({
    "socket":socket,
    "id": socket.id,
    "hand": deal()
  });
  turns.push(false);
  return {...context, "players": players, "turns": turns};
}

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    console.log(msg)
    if(msg.player === context.players[context.turnIndex].id){
      let play = playCard(msg.player, msg.card);
      if(play){
        io.emit('chat message', `${context.discardDeck[0].color} - ${context.discardDeck[0].number}`);
        messages.push(msg.card);
        sendHand();
      } else {
        let [card] = deal(1);
        context.players[context.turnIndex].hand.push(card);
        sendHand();
      }
      context = nextTurn(context);
    }
  });
});

function sendHand() {
  context.players[context.turnIndex].socket.emit("hand", context.players[context.turnIndex].hand);
}
server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});

context.deck = createDeck(0.5, false);

function firstCard() {
  let index = context.deck.findIndex(card => card.isAction === false);
  let [card] = context.deck.splice(index, 1);
  context.discardDeck.unshift(card);
  //TODO eliminar
  console.log('Primera carta:');
  console.log(context.discardDeck[0]);
}

function deal(cards = 7) {
  return context.deck.splice(0,cards);
}

function discardCard(player, index) {
  let [card] = player.hand.splice(index, 1);
  context.discardDeck.unshift(card);
}

function checkColor(card1, card2) {
  return card1.color.some(color => card2.color.includes(color));
}

function playCard(playerId, cardId) {
  let player = context.players.find(player => player.id === playerId);
  let cardIndex = player.hand.findIndex(card => card.id === cardId);
  if(cardIndex !== -1){
    let card = player.hand[cardIndex];
    let lastCard = context.discardDeck[0];
    // cartas normales
    if(!card.isAction){
      if(checkColor(card, lastCard) || card.number === lastCard.number){
        discardCard(player, cardIndex);
        return true;
      }
      return false
    } else {
      if(card.isChain && lastCard.isChain){
        return true;
      }
      if(checkColor(card, lastCard) || card.number === lastCard.number){
        return true;
      }
      if(card.isWild){
        return true;
      }
    }
  } else {
    return false;
  }
}
// TODO cuando se juega wild, cambiar la tarjeta y reiniciarla cuando se recicla la carta
// TODO probar el nuevo context