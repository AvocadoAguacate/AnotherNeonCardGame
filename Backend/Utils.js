import { mixUpDeck } from './CardFactory.js';

export function sendHand(player) {
  let lhand = player.hand.map(card => {
    return {"id": card.id, "number": card.number, "color": card.color}
  });
  player.socket.emit("hand", lhand);
}

export function notifyHands(players, io) {
  let report = players.map(player => player.hand.length);
  io.emit('hands', report);
}

export function deal(context, index, number) {
  // TODO actualizar a 80
  context.deck.length <= 40 && (context = refillDeck(context));
  let { players, deck } = context;
  let dealCards = deck.splice(0, number);
  players[index].hand.push(...dealCards);
  sendHand(players[index]);
  return {...context, 'players': players};
}

export function closeChain(context) {
  context = deal(context, context.turnIndex, context.chain.sum);
  return {...context, 'chain': {}};
}

export function discardCard(context, playerIndex, cardIndex) {
  let {players, discardCard, discardDeck} = context;
  let [card] = players[playerIndex].hand.splice(cardIndex, 1);
  discardDeck.unshift(card);
  sendHand(players[playerIndex]);
  return {...context, discardCard, players};
}

export function checkColor(card1, card2) {
  return card1.color.some(color => card2.color.includes(color));
}

function refillDeck(context) {
  let {deck, discardDeck} = context
  let cards = discardDeck.splice(1, discardDeck.length - 1);
  deck.push(...cards);
  return {...context, discardDeck, deck: mixUpDeck(deck)};
}

export function sendDiscardDeck(context) {
  let {io, messages, discardDeck} = context;
  let color = discardDeck[0].color;
  if(context.hide){
    color = ['hide'];
    context.hide = false;
  }
  let message = `${color} - ${discardDeck[0].number}`;
  io.emit('chat message', message);
  messages.push(message);
  return {...context, messages};
}