import { v4 as uuidv4 } from 'uuid';
import { sendHand, deal, closeChain } from './Utils.js';

function cardFactory(number, color, isFlex = [], isAction = false) {
  let card = {
    id: uuidv4(),
    color: [color],
    isWild: false,
    isAction,
    isChain: false
  }
  if(number !== null){
    card = {number: number, ...card};
  }
  if(isFlex.length > 0){
    let secondColorIndex = Math.floor(Math.random() * isFlex.length);
    card.color =  [color, isFlex[secondColorIndex]];
  }
  // TODO update isWild, isChain, colors
  if(isAction){
    switch (number) {
      case 0:
        card = {execute: changeAll, ...card};
        break;
      case 7:
        card = {execute: changeOne, ...card};
        break;
      case 10:
        card = {execute: slice2, ...card};
        break;
      case 11:
        card = {execute: slice4, ...card, isWild: true, color:[]};
        break;
      case 12:
        card = {execute: grenate, ...card, isWild: true, color:[]};
        break;
      case 13:
        card = {execute: kick, ...card};
        break;
      case 14:
        card = {execute: reverse10, ...card};
        break;
      case 15:
        card = {execute: reverse25, ...card};
        break;
      case 16:
        card = {execute: reverse50, ...card};
        break;
      case 17:
        card = {execute: reverse100, ...card};
        break;
      case 18:
        card = {execute: skip10, ...card};
        break;
      case 19:
        card = {execute: skip25, ...card};
        break;
      case 20:
        card = {execute: skip50, ...card};
        break;
      case 21:
        card = {execute: skip100, ...card};
        break;
      case 22:
        card = {execute: add2, ...card, isWild: true, color:[]};
        break;
      case 23:
        card = {execute: add3, ...card};
        break;
      case 24:
        card = {execute: add4, ...card, isWild: true, color:[]};
        break;
      case 25:
        card = {execute: add5, ...card};
      case 26:
        card = {execute: add6, ...card, isWild: true, color:[]};
        break;
      case 27:
        card = {execute: add7, ...card};
        break;
      case 28:
        card = {execute: add8, ...card, isWild: true, color:[]};
        break;
      case 30:
        card = {execute: add10, ...card, isWild: true, color:[]};
        break;
      case 31:
        card = {execute: d4, ...card};
        break;
      case 32:
        card = {execute: d6, ...card};
        break;
      case 33:
        card = {execute: d12, ...card, isWild: true, color:[]};
        break;
      case 34:
        card = {execute: d20, ...card, isWild: true, color:[]};
        break;
      case 35:
        card = {execute: kami, ...card, isWild: true, color:[]};
        break;
      default:
        break;
    }
  }
  return card
}

function slice2(context) {
  
}

function slice4(context) {
  
}

function slice(context) {
  
}

function grenate(context) {
  
}

function kick(context) {
  
}

function reverse(context) {
  
}

function reverse10(context) {
  
}

function reverse25(context) {
  
}
function reverse50(context) {
  
}
function reverse100(context) {
  
}
function skip(context) {
  
}

function skip10(context) {
  
}

function skip25(context) {
  
}
function skip50(context) {
  
}
function skip100(context) {
  
}

function dice(context, number) {
  
}

function d4(context) {
  
}
function d6(context) {
  
}
function d12(context) {
  
}
function d20(context) {
  
}

function kami(context) {
  
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
  return {...context, players};
}

function changeOne(context) {
  let {payLoad, players, turnIndex} = context
  let temp = [...players[turnIndex].hand];
  players[turnIndex].hand = [...players[payLoad.target].hand];
  players[payLoad.target].hand = temp;
  sendHand(players[turnIndex]);
  sendHand(players[payLoad.target]);
  return {...context, players}
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
  discardDeck[0].color = [payLoad.wildColorChange];
  return {...context, payLoad, discardDeck};
}

function addCards(context, number) {
  let {chain, turnIndex, players, discardDeck, deck, turns} = context
  if(!chain.sum){ //new chain
    chain = {
      "sum": number,
      "members": JSON.parse(JSON.stringify(turns)), 
    }
  } else {
    // TODO +2 =22 +10 =30 kami =35 dices 31-34
    let remainder = discardDeck[1].number - discardDeck[0].number;
    if(remainder > 0){//is unpaid
      context = deal(context, turnIndex, remainder);
    }
    chain.members[turnIndex] = true;
    chain.sum += number;
  }
  return {...context, chain};
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
export function createDeck(flexP = 0.5, actionConfig = createActionConfig()) {
  let deck = [];
  // let isFlex = flexP > 0
  // only numbers 80 (0-9 40 * 2)
  // let blue0 = createNumbers('blue', isFlex, flexP);
  // let blue1 = createNumbers('blue', isFlex, flexP);
  // let green0 = createNumbers('green', isFlex, flexP);
  // let green1 = createNumbers('green', isFlex, flexP);
  // let red0 = createNumbers('red', isFlex, flexP);
  // let red1 = createNumbers('red', isFlex, flexP);
  // let yellow0 = createNumbers('yellow', isFlex, flexP);
  // let yellow1 = createNumbers('yellow', isFlex, flexP);
  // deck.push(...blue0, ...blue1, ...green0, ...green1, ...red0, ...red1, ...yellow0, ...yellow1);
  
  actionConfig.forEach((quantity, index) => {
    let card = {};
    for (let i = 0; i < quantity; i++) {
      let {color, isFlex} = flexer(flexP, i);
      if(index > 9){//action
        card = cardFactory(index, color, isFlex, true);
      } else { //0-9
        card = cardFactory(index, color, isFlex, index === 0 || index === 7);
      }
    }
    deck.push(card);
  });
  // return mixUpDeck(deck);
  return deck;
}
function flexer(flexP, i) {
  let colors = ['green', 'blue', 'yellow', 'red'];
  let originalColor = colors[Math.floor(i/2)];//i [0,8[
  if(Math.random() < flexP){
    return {color: originalColor, isFlex:flexColors(originalColor, isFlex)};
  }
  return {color: originalColor, isFlex:[]};
}

export function createActionConfig(
  s2 = 6, s4 = 8, grenades = 4, kicks = 8,
  r10 =  8, r25 = 8, r50 = 6, r100 = 6,
  s10 =  8, s25 = 8, s50 = 6, s100 = 6,
  add2 = 6, add3 = 8, add4 = 6, add5 = 8, 
  add6 = 6, add7 = 6, add8 = 5, add10 = 4,
  d4 =  8, d6 = 8, d12 = 6, d20 = 4,
  kami = 8//35  
) {
  return [
    8, 8, 8, 8, 8, 8, 8, 8, 8, 8,//0-9
    s2, s4, grenades, kicks, //10-13
    r10, r25, r50, r100,//14-17
    s10, s25, s50, s100,//18-21
    add2, add3, add4,//22-24
    add5, add6, add7,//25-27
    add8, 0 ,add10,//28-30
    d4, d6, d12, d20, //31-34
    kami //35
  ];
}