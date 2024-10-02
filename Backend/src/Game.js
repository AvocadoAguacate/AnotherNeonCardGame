import { createDeck, mixUpDeck, createActionConfig } from './Cards/CardFactory.js';
import { sendHand, deal, closeChain, checkColor, sendDiscardDeck, inform } from './Utils.js';
import { v4 as uuidv4 } from 'uuid';

let context = {
  players: [],
  turns: [],
  direction: 1,
  turnIndex:0,
  deck: [],
  discardDeck: [],
  chain: {},
  messages: []
}

let challenges = [];
let gameStarted = false;
let readyList = [];

//TODO test zone, eliminate
const slices = [0,0];
const grenadesKicks = [0,0];
const reversesSkips = [0,0,0,0,0,0,0,0];
const adds = [0,0,0,0,0,0,0,0];
const dices = [0,0,0,0];
const kamiGenocide = [0,0];
const dareHide = [100,100];
const taxes = [100,0];
const hideWild = [1];
const telAdds = [100,0,0,0];
const redirectRuleteComunGift = [0,0,0,0];
const resetDuels = [0,0,0,0]

let deckConfig = createActionConfig(...slices, ...grenadesKicks, 
  ...reversesSkips,...adds, ...dices, ...kamiGenocide, ...dareHide, ...taxes, 
  ...hideWild, ...telAdds, ...redirectRuleteComunGift, ...resetDuels);
let votedDeck = [];

export function addIO(io){
  context = {io, ...context};
}

export function nextTurn() {
  let {turns, turnIndex, direction, players} = context;
  turns[turnIndex] = false;
  turnIndex = (turnIndex + direction + players.length) % players.length;
  turns[turnIndex] = true;
  context = {...context, "turnIndex": turnIndex, "turns": turns};
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
  let playerIndex = players.length;
  players.push({
    socket:payLoad.socket,
    id: payLoad.id,
    hand: [],
    name: payLoad.name,
    picIndex: payLoad.picIndex
  });
  turns.push(false);
  if(gameStarted){
    readyList.push(true);
    votedDeck.push(true);
    context = deal(context, context.players.length -1, 9);
  } else {
    readyList.push(false);
    votedDeck.push(false);
    sendVoteOptions(playerIndex);
  }
  context = {...context, "players": players, "turns": turns};
}

function sendVoteOptions(playerIndex) {
  let options = [];
  for (let index = 0; index < 6; index++) {
    options.push(Math.floor(Math.random() * deckConfig.length - 1));
  }
  context.players[playerIndex].socket.emit('voteOptions', {options});
}

export function firstCard() {
  let {deck, discardDeck} = context;
  let index = deck.findIndex(card => card.isAction === false);
  let [card] = deck.splice(index, 1);
  discardDeck.unshift(card);
  context = {...context, deck, discardDeck};
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
    nextTurn();
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
  let {playerId, status} = msg;
  let playerIndex = context.players.findIndex(player => player.id ===playerId);
  readyList[playerIndex] = status;
  let initGame = true;
  readyList.forEach(playerStatus => {
    if(!playerStatus){
      initGame = playerStatus
    }
  });
  if(initGame){
    startGame();
  } else {
    inform('isReady', {playerId, status});
  }
}

function startGame() {
  gameStarted = true;
  createDeck(0.7, deckConfig);
  firstCard(context);
  firstPlayer();
  //TODO update
  inform('gameStarted', {turns: context.turns});
}

export function voteDeck(msg) {
  voterIndex = context.players.findIndex(player => player.id === msg.id);
  if(!votedDeck[voterIndex]){
    const randInc0 = Math.floor(Math.random() * 9 + 1);
    const randInc1 = Math.floor(Math.random() * 5 + 1);
    deckConfig[msg.vote[0]] += randInc0;
    deckConfig[msg.vote[1]] += randInc1;
    votedDeck[voterIndex] = true;
  }
}

function resetVotes() {
  deckConfig = createActionConfig();
  votedDeck.forEach(player => false);
}

export function playChallenge(msg) {
  const {challengeId} = msg;
  if(!challengeId){
    let {oponent, challenger} = msg;
    let challenge = {
      id: uuidv4(),
      oponent,
      challenger
    };
    challenges.push(challenge);
    const oneCase = context.players[oponent].hand.length === 1;
    if(oneCase){
      playChallenge({challengeId: challenge.id});
    }
    inform('createChallenge', {oneCase, ...challenge});
  } else {
    const {oponent, challenger} = challenges.find(challenge => challenge.id === challengeId);
    const oponentTry = Math.floor(Math.random() * 19 + 1);
    const challengerTry = Math.floor(Math.random() * 19 + 1);
    deal(context, challengerTry > oponentTry ? oponent : challenger, 1);
    inform('resultChallenge', {oponentTry, challengerTry});
  }
}