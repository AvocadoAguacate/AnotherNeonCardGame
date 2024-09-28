import { v4 as uuidv4 } from 'uuid';
import { sendHand, deal, closeChain, discardCard, checkColor } from './Utils.js';

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
  if(isAction){
    switch (number) {
      case 0:
        card = {execute: changeAll, ...card};
        break;
      case 7:
        card = {execute: changeOne, ...card};
        break;
      case 10:
        card = {execute: slice2, ...card , isWild: true, color:[]};
        break;
      case 11:
        card = {execute: slice4, ...card};
        break;
      case 12:
        card = {execute: grenate, ...card, isWild: true, color:[]};
        break;
      case 13:
        card = {execute: kick, ...card};
        break;
      case 14:
        card = {execute: reverse10, ...card, isChain: true};
        break;
      case 15:
        card = {execute: reverse25, ...card, isChain: true};
        break;
      case 16:
        card = {execute: reverse50, ...card, isChain: true};
        break;
      case 17:
        card = {execute: reverse100, ...card, isChain: true};
        break;
      case 18:
        card = {execute: skip10, ...card, isChain: true};
        break;
      case 19:
        card = {execute: skip25, ...card, isChain: true};
        break;
      case 20:
        card = {execute: skip50, ...card, isChain: true};
        break;
      case 21:
        card = {execute: skip100, ...card, isChain: true};
        break;
      case 22:
        card = {execute: add2, ...card, isWild: true, color:[], isChain: true};
        break;
      case 23:
        card = {execute: add3, ...card, isChain: true};
        break;
      case 24:
        card = {execute: add4, ...card, isWild: true, color:[], isChain: true};
        break;
      case 25:
        card = {execute: add5, ...card, isChain: true};
        break;
      case 26:
        card = {execute: add6, ...card, isWild: true, color:[], isChain: true};
        break;
      case 27:
        card = {execute: add7, ...card, isChain: true};
        break;
      case 28:
        card = {execute: add8, ...card, isWild: true, color:[], isChain: true};
        break;
      case 30:
        card = {execute: add10, ...card, isWild: true, color:[], isChain: true};
        break;
      case 31:
        card = {execute: d4, ...card, isChain: true};
        break;
      case 32:
        card = {execute: d6, ...card, isChain: true};
        break;
      case 33:
        card = {execute: d12, ...card, isWild: true, color:[], isChain: true};
        break;
      case 34:
        card = {execute: d20, ...card, isWild: true, color:[], isChain: true};
        break;
      case 35:
        card = {execute: kami, ...card, isWild: true, color:[], isChain: true};
        break;
      case 36:
        card = {execute: genocide, ...card, isWild: true, color:[]};
        break;
      case 37:
        let dnumber = Math.floor(Math.random() * 9); 
        dnumber = dnumber === 7 || dnumber === 0 ? dnumber + 1 : dnumber;
        card = {execute: dare, ...card, isAction: true, number: dnumber};
        break;
      case 38:
        let hnumber = Math.floor(Math.random() * 9);
        hnumber = hnumber === 7 || hnumber === 0 ? hnumber + 1 : hnumber;
        card = {execute: hide, ...card, isAction: true, number: hnumber};
        break;
      case 39:
        card = {execute: tax50, ...card, isAction: true, color:[], isWild: true};
        break;
      case 40:
        card = {execute: tax25, ...card, isAction: true};
        break;
      case 41:
        card ={execute: hideWild, ...card, isAction:true, color:[], isWild: true};
        break;
      default:
        break;
    }
  }
  console.log(card);
  return card
}

function hideWild(context) {
  context = wildColorChange(context);
  let {payLoad, discardCard} = context;
  discardCard[0].number = payLoad.hideWildNumber;
  return {...context, isHide:true, discardCard};
}

function tax25(context) {
  return tax(context, 0.25);
}

function tax50(context) {
  context = wildColorChange(context);
  return tax(context, 0.5);
}

function tax(context, number) {
  let {players} = context;
  players.forEach((player, playerIndex) => {
    let tax = Math.floor(player.hand.length * number);
    for (let index = 0; index < tax; index++) {
      let random = Math.floor(Math.random * player.hand.length - 1);
      context = discardCard(context, playerIndex, random);
    }
  });
  return {...context};
}

function hide(context) {
  return {...context, isHide:true};
}

function dare(context) {
  let {discardDeck} = context;
  discardDeck[0].color = [];
  return {...context, discardDeck};
}

function genocide(context) {
  let {players, payLoad} = context
  players.forEach((player, playerIndex) => {
    player.hand.forEach((card, cardIndex) => {
      if(checkColor(card, {color: payLoad.genocideColor})){
        context = discardCard(context,playerIndex, cardIndex);
      }
    });
  });
  return {...context};
}

function slice2(context) {
  return slice(context, 2);
}

function slice4(context) {
  context = wildColorChange(context);
  return slice(context, 4);
}

function slice(context, number) {
  let {payLoad, turnIndex, players} = context;
  let maxDiscard = Math.floor(players[turnIndex].hand.length / number);
  if(payLoad.toDiscard.length > maxDiscard){
    payLoad.toDiscard = payLoad.toDiscard.splice(0, maxDiscard);
  }
  payLoad.toDiscard.forEach(toDiscard => {
    context = discardCard(context, turnIndex, toDiscard);
  })
  return {...context};
}

function grenate(context) {
  let {turnIndex, direction, players} = context;
  context = wildColorChange(context);
  let right = (turnIndex + direction + players.length) % players.length;
  let left = (turnIndex - direction + players.length) % players.length;
  let explotion = Math.ceil(Math.random() * 12 + 1);
  let explotionR = Math.floor(Math.random() * 12 + 1);
  let explotionL = Math.floor(Math.random() * 12 + 1);
  context = deal(context, turnIndex, explotion);
  context = deal(context, left, explotionL);
  context = deal(context, right, explotionR);
  return {...context};
}

function kick(context) {
  let {players} = context;
  let oneCard = players.map(player => player.hand.length === 1 ? true : false);
  if(oneCard > 0){
    oneCard.forEach((isOne, index) => {
      if(isOne){
        context = deal(context, index, 4);
      }
    })
  } else {
    let twoCards = players.map(player => player.hand.length === 2 ? true : false);
    if(twoCards > 0){
      twoCards.forEach((isTwo, index) => {
        if(isTwo){
          context = deal(context, index, 2);
        }
      });
    } else {
      players.forEach((player, index) => {
        context = deal(context, index, 1);
      });
    }
    return {...context};
  }
}

function defense(context, number) {
  let {chain, turnIndex} = context;
  let total = Math.floor(chain.sum * number); 
  deal(context, turnIndex, total);
  return {...context};
}

function reverse(context) {
  let {direction} = context;
  direction *= -1;
  return {...context, direction};
}

function reverse10(context) {
  if(context.chain.sum){
    context = defense(context, 0.9);
  }
  return reverse(context);
}

function reverse25(context) {
  if(context.chain.sum){
    context = defense(context, 0.75);
  }
  return reverse(context);
}
function reverse50(context) {
  if(context.chain.sum){
    context = defense(context, 0.5);
  }
  return reverse(context);
}
function reverse100(context) {
  if(context.chain.sum){
    context = defense(context, 0);
  }
  return reverse(context);
}

function skip(context) {
  let {turns, turnIndex, direction, players} = context;
  turns[turnIndex] = false;
  turnIndex = (turnIndex + direction + players.length) % players.length;
  return {...context, turns, turnIndex};
}

function skip10(context) {
  if(context.chain.sum){
    context = defense(context, 0.9);
  }
  return skip(context);
}

function skip25(context) {
  if(context.chain.sum){
    context = defense(context, 0.75);
  }
  return skip(context);
}
function skip50(context) {
  if(context.chain.sum){
    context = defense(context, 0.5);
  }
  return skip(context);
}
function skip100(context) {
  if(context.chain.sum){
    context = defense(context, 0);
  }
  return skip(context);
}

function dice(context, number) {
  let dice = Math.floor(Math.random() * number + 1);
  context = addCards(context, dice);
  return {...context};
}

function d4(context) {
  return dice(context, 4);
}
function d6(context) {
  return dice(context, 6);
}
function d12(context) {
  context = wildColorChange(context);
  return dice(context, 12);
}
function d20(context) {
  context = wildColorChange(context);
  return dice(context, 20);
}

function kami(context) {
  let {chain} = context;
  context = wildColorChange(context);
  chain.members.forEach((isMember, index) => {
    if(isMember){
      context = deal(context, index, chain.sum);
    }
  })
  return {...context, chain:{}};
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

function add2(context) {
  context = wildColorChange(context);
  return addCards(context, 2);
}

function add3(context) {
  return addCards(context, 3);
}

function add4(context) {
  context = wildColorChange(context);
  return addCards(context, 4);
}

function add5(context) {
  return addCards(context, 5);
}

function add6(context) {
  context = wildColorChange(context);
  return addCards(context, 6);
}

function add7(context) {
  return addCards(context, 7);
}

function add8(context) {
  context = wildColorChange(context);
  return addCards(context, 8);
}

function add10(context) {
  context = wildColorChange(context);
  return addCards(context, 10);
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
      sum: number,
      members: JSON.parse(JSON.stringify(turns)), 
    }
  } else {
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
  actionConfig.forEach((quantity, index) => {
    let card = {};
    for (let i = 0; i < quantity; i++) {
      if(index > 9){//action
        let {color, isFlex} = flexer(1, Math.floor(Math.random() * 6 + 1));
        card = cardFactory(index, color, isFlex, true);
      } else { //0-9
        let {color, isFlex} = flexer(flexP, i);
        card = cardFactory(index, color, isFlex, index === 0 || index === 7);
      }
      deck.push(card);
    }
  });
  // TODO eliminar, es para testear una carta en concreto
  // for (let index = 0; index < 100; index++) {
  //   let {color, isFlex} = flexer(1, Math.floor(Math.random() * 6 + 1));
  //   let card = cardFactory(18, color, isFlex, true);
  //   deck.push(card);
  // }
  return mixUpDeck(deck);
  // console.log('Deck:');
  // console.log(deck);
  // console.log(deck.length);
  // return deck;
}
function flexer(flexP, i) {
  let colors = ['green', 'blue', 'yellow', 'red'];
  let originalColor = colors[Math.floor(i/2)];//i [0,8[
  if(Math.random() < flexP){
    return {color: originalColor, isFlex: flexColors(originalColor, true)};
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
  kami = 8, genocide = 4, dare = 40, hide = 40,//35-38
  tax25 = 8, tax50 = 4, hideWild = 8
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
    kami, genocide, dare, hide, //35-38
    tax25, tax50, hideWild //39-41
  ];
}