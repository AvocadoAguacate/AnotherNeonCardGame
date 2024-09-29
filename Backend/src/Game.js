import { createDeck, mixUpDeck, createActionConfig } from './Cards/CardFactory.js';
import { sendHand, deal, closeChain, checkColor, sendDiscardDeck } from './Utils.js';

export function nextTurn(context) {
  let {turns, turnIndex, direction, players} = context;
  turns[turnIndex] = false;
  turnIndex = (turnIndex + direction + players.length) % players.length;
  turns[turnIndex] = true;
  return {...context, "turnIndex": turnIndex, "turns": turns}
}

export function firstPlayer() {
  if(context.players.length > 1){
    let first = Math.floor(Math.random() * context.players.length);
    context.turnIndex = first;
    context.turns[turnIndex] = true;
  }
}

export function addPlayer(socket, context) {
  let {players, turns} = context;
  players.push({
    "socket":socket,
    "id": socket.id,
    "hand": []
  });
  turns.push(false);
  return {...context, "players": players, "turns": turns};
}

export function firstCard(context) {
  let {deck, discardDeck} = context;
  let index = deck.findIndex(card => card.isAction === false);
  let [card] = deck.splice(index, 1);
  discardDeck.unshift(card);
  return {...context, deck, discardDeck};
}