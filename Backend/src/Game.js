import { createDeck, mixUpDeck, createActionConfig } from './Cards/CardFactory.js';
import { sendHand, deal, closeChain, checkColor, sendDiscardDeck } from './Utils.js';

let context = {
  players: [],
  turns: [],
  direction: 1,
  turnIndex:0,
  deck: [],
  discardDeck: [],
  chain: {},
  io,
  messages: []
}

const slices = [0,0];
const grenadesKicks = [0,0];
const reversesSkips = [0,0,0,0,0,0,0,0];
const adds = [0,0,0,0,0,0,0,0];
const dices = [0,0,0,0];
const kamiGenocide = [0,0];
const dareHide = [30,1];
const taxes = [2,0];
const hideWild = [0];

context.deck = createDeck(0.7, createActionConfig(...slices, ...grenadesKicks, 
  ...reversesSkips,...adds, ...dices, ...kamiGenocide, ...dareHide, ...taxes, 
  ...hideWild));

export function addIO(io){
  context = {io, ...context};
}

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

export function addPlayer(payLoad) {
  let {players, turns} = context;
  players.push({
    socket:payLoad.socket,
    id: payLoad.socket.id,
    hand: [],
    name: payLoad.name,
    picIndex: payLoad.picIndex
  });
  turns.push(false);
  context = {...context, "players": players, "turns": turns};
}

export function firstCard(context) {
  let {deck, discardDeck} = context;
  let index = deck.findIndex(card => card.isAction === false);
  let [card] = deck.splice(index, 1);
  discardDeck.unshift(card);
  return {...context, deck, discardDeck};
}

function discardCard(player, index) {
  let [card] = player.hand.splice(index, 1);
  context.discardDeck.unshift(card);
}

export function playTurn(msg) {
  if(msg.player === context.players[context.turnIndex].id){
    if(msg.card){
      if(playCard(msg.player, msg.card, msg.payLoad)){
        context = sendDiscardDeck(context);
        sendHand(context.players[context.turnIndex]);
      } else {
        context = deal(context, context.turnIndex, 1);
      }
    } else {
      payLoader(msg.payLoad);
    }
    context = nextTurn(context);
  }
}

function playCard(playerId, cardId, payLoad) {
  let player = context.players.find(player => player.id === playerId);
  let cardIndex = player.hand.findIndex(card => card.id === cardId);
  if(cardIndex !== -1){
    let card = player.hand[cardIndex];
    let lastCard = context.discardDeck[0];
    //? no responder a la cadena
    if(context.chain.sum && !card.isChain){
      context = closeChain(context);
      return false;
    }
    //? cartas normales
    if(!card.isAction){
      if(checkColor(card, lastCard) || card.number === lastCard.number){
        discardCard(player, cardIndex);
        return true;
      }
      return false
    } else {
    //? cartas de acción
      if(checkColor(card, lastCard) 
        || card.number === lastCard.number 
        || card.isChain && lastCard.isChain 
        || card.isWild){
        discardCard(player, cardIndex);
        context = {...context, "payLoad": payLoad};
        context = card.execute(context);
        return true;
      }
    }
  } else {
    return false;
  }
}

function payLoader(payLoad) {
  if(context.chain.sum){
    if(payLoad.challengeLuck.isEven){
      challengeLuck(payLoad.challengeLuck);
    } else {
      context = closeChain(context);
    }
  }
}

function challengeLuck(challenge) {
  let random = Math.floor(Math.random() * 19 + 1);
  if(random === challenge.number){
    context.chain = {};
    inform('luckCompleteWin',{random, number: challenge.number});
  } else {
    if(challenge.isEven && random % 2 === 0){
      context.chain.sum = Math.floor(context.chain.sum / 2);
      inform('luckHalfWin', {random, isEven: challenge.isEven, newSum: context.chain.sum});
    }
    inform('luckLose',{random});
    context = closeChain(context);
  }
}

export function playerReady(msg) {
  //TODO 
}

export function voteDeck(msg) {
  //TODO
}

export function playChallenge(msg) {
  //TODO
}