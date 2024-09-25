import { v4 as uuidv4 } from 'uuid';
import { sendHand } from './Utils.js';

function cardFactory(number, color, isFlex = [], isWild = false, isAction = false, type = "", isChain = false) {
  let card = {
    "id": uuidv4(),
    "color": [color],
    "isWild": isWild,
    "isAction": isAction,
    "isChain": isChain
  }
  if(number !== null){
    card = {"number": number, ...card};
  }
  if(isFlex.length > 0){
    let secondColorIndex = Math.floor(Math.random() * isFlex.length);
    card.color =  [color, isFlex[secondColorIndex]];
  }
  if(isAction){
    card = {"type": type, ...card}
  }
  if(isAction){
    switch (number) {
      case 0:
        card = {"execute": changeAll, ...card};
        break;
      case 7:
        card = {"execute": changeOne, ...card};
        break;
      case 22:
        card = {"execute": add2, ...card};
        break;
      case 23:
        card = {"execute": add3, ...card};
        break;
      case 24:
        card = {"execute": add4, ...card};
        break;
      case 25:
        card = {"execute": add5, ...card};
      case 26:
        card = {"execute": add6, ...card};
        break;
      case 27:
        card = {"execute": add7, ...card};
        break;
      case 28:
        card = {"execute": add8, ...card};
        break;
      case 30:
        card = {"execute": add10, ...card};
      break;
      default:
        break;
    }
  }
  return card
}

function changeAll(context) {
  let {players, direction} = context;
  let toRight = direction === 1 ? true : false;
  let temp = toRight ? [...players[players.length - 1].hand] : [...players[0].hand]; 
  if(toRight){
    for (let index = 1; index < players.length; index++) {
      players[index].hand = [...players[index - 1].hand];
    }
    players[0].hand = temp;
  } else {
    for (let index = players.length - 2; index >= 0; index--) {
      players[index].hand = [...players[index + 1].hand];
    }
    players[players.length - 1].hand = temp;
  }
  players.forEach( player => {
    sendHand(player);
  })
  return {...context, "players": players};
}

function changeOne(context) {
  let {payLoad, players, turnIndex} = context
  let temp = [...players[turnIndex].hand];
  players[turnIndex].hand = [...players[payLoad.target].hand];
  players[payLoad.target].hand = temp;
  sendHand(players[turnIndex]);
  sendHand(players[payLoad.target]);
  return {...context, "players": players}
}

function createNumbers(color, isFlex, flex) {
  let deck = [];
  let colors = flexColors(color, isFlex);
  for (let index = 0; index < 10; index++) {
    let card = {};
    let flexCard = Math.random() < flex ? colors : [];
    if(index !== 0 && index !== 7){
      card = cardFactory(index, color, flexCard);
    } else {
      if(index === 0){
        card = cardFactory(index, color, flexCard, false, true, "changeAll");
      } else { // 7
        card = cardFactory(index, color, flexCard, false, true, "changeOne");
      }
    }
    deck.push(card);
  }
  return deck;
}

function add2(context) {
  let newContext = wildColorChange(context);
  return addCards(newContext, 2);
}

function add3(context) {
  return addCards(context, 3);
}

function add4(context) {
  let newContext = wildColorChange(context);
  return addCards(newContext, 4);
}

function add5(context) {
  return addCards(context, 5);
}

function add6(context) {
  let newContext = wildColorChange(context);
  return addCards(newContext, 6);
}

function add7(context) {
  return addCards(context, 7);
}

function add8(context) {
  let newContext = wildColorChange(context);
  return addCards(newContext, 8);
}

function add10(context) {
  let newContext = wildColorChange(context);
  return addCards(newContext, 10);
}

function wildColorChange(context) {
  let {payLoad, discardDeck} = context;
  discardDeck[0].color = payLoad.wildColorChange;
  return {...context, 'payLoad':payLoad, 'discardDeck': discardDeck};
}

function addCards(context, number) {
  let {chain, turnIndex, players, discardDeck, deck, turns} = context
  // TODO +2 =22 +10 =30 kami =35 dices 31-34
  let remainder = discardDeck[1].number - discardDeck[0].number;
  if(remainder > 0){//is unpaid
    // TODO deal(player, quantity) in Utils
    let [paidCards] = deck.splice(0, remainder - 1);
    players[turnIndex].hand.push(paidCards);
    sendHand(players[turnIndex]);
  }
  if(!chain.sum){ //new chain
    chain = {
      "sum": number,
      "members": JSON.parse(JSON.stringify(turns)), 
    }
  } 
  return {...context, "chain": chain, "players": players};
}

function flexColors(color, isFlex = false) {
  if(!isFlex){
    return [];
  }
  let colors = [];
  switch (color) {
    case 'green':
      colors = ['blue', 'yellow', 'red'];
      break;
    case 'blue':
      colors = ['green', 'yellow', 'red'];
      break;
    case 'yellow':
      colors = ['blue', 'green', 'red'];
      break;
    case 'red':
      colors = ['green', 'yellow', 'blue'];
      break;
    default:
      break;
  }
  return colors;
}

export function mixUpDeck(deck) {
  deck.forEach((_, i) => {
      const j = Math.floor(Math.random() * deck.length);
      [deck[i], deck[j]] = [deck[j], deck[i]];
  });
  return deck;
}

export function createDeck(flexP = 0, isFlip = false, actionConfig) {
  let deck = [];
  let isFlex = flexP > 0
  // only numbers 80 (0-9 40 * 2)
  let blue0 = createNumbers('blue', isFlex, flexP);
  let blue1 = createNumbers('blue', isFlex, flexP);
  let green0 = createNumbers('green', isFlex, flexP);
  let green1 = createNumbers('green', isFlex, flexP);
  let red0 = createNumbers('red', isFlex, flexP);
  let red1 = createNumbers('red', isFlex, flexP);
  let yellow0 = createNumbers('yellow', isFlex, flexP);
  let yellow1 = createNumbers('yellow', isFlex, flexP);
  deck.push(...blue0, ...blue1, ...green0, ...green1, ...red0, ...red1, ...yellow0, ...yellow1);
  console.log(deck);
  return mixUpDeck(deck);
}

export function createActionConfig(dices = 8, slices = 8) {
  let config = {};
  if(dices > 0){
    config = {"isDice": true, "dices": dices, ...config};
  } else {
    config = {"isDice": false, ...config};
  }
  if(slices > 0){
    config = {"isSlice": true, "slices": slices, ...config};
  } else {
    config = {"isSlice": false, ...config};
  }
  return config;
}