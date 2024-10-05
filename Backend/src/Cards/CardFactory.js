import { v4 as uuidv4 } from 'uuid';
import {
  slice2, slice4, grenate, kick,
  reverse10, reverse25, reverse50, reverse100,
  skip10, skip25, skip50, skip100,
  add2, add3, add4, add5, add6, add7, add8, add10,
  d8, d6, d12, d20, kami, genocide, dare, hide,
  tax25, tax50, hideWild, changeAll, changeOne,
  telAdd1, telAdd2, telAdd3, telAdd4, redirect,
  rulete, communism, gift,
  reset,
  duelDeal2,
  duelDiscard2,
  duelDD,
  vudu,
  gini0,
  changePos,
  changeAllPos
} from './CardActions.js';

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
        card = {execute: d6, ...card, isChain: true};
        break;
      case 32:
        card = {execute: d8, ...card, isChain: true};
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
        card = {execute: dare, ...card, isAction: true, number: dnumber};
        break;
      case 38:
        let hnumber = Math.floor(Math.random() * 9);
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
      case 42:
        card = {execute: telAdd1, ...card, isAction: true, color: [color[0]]};
        break;
      case 43:
        card = {execute: telAdd2, ...card, isAction: true};
        break;
      case 44:
        card = {execute: telAdd3, ...card, isAction:true, color:[], isWild: true};
        break;
      case 45:
        card = {execute: telAdd4, ...card, isAction:true, color:[], isWild: true};
        break;
      case 46:
        card = {execute: redirect, ...card, isAction:true, isChain: true};
        break;
      case 47:
        card = {execute: rulete, ...card, isAction:true};
        break;
      case 48:
        card = {execute: communism, ...card, isAction:true, color: ['red']};
        break;
      case 49:
        card = {execute: gift, ...card, isAction:true, color: ['red', 'green']};
        break;
      case 50:
        card = {execute: reset, ...card, isAction:true, color:[], isWild: true};
      case 51:
        card = {execute: duelDeal2, ...card, isAction:true};
        break;
      case 52:
        card = {execute: duelDiscard2, ...card, isAction:true};
        break;
      case 53:
        card = {execute: duelDD, ...card, isAction:true, color:[], isWild: true};
        break;
      case 54:
        card = {execute: changeAll, ...card, isAction:true, color:[], isWild: true};
        break;
      case 55:
        card = {execute: changeOne, ...card, isAction:true,};
        break;
      case 56:
        card = {execute: vudu, ...card, isAction:true};
        break;
      case 57:
        card = {execute:gini0, ...card, isAction:true, isChain:true};
        break;
      case 58:
        card = {execute:changePos, ...card, isAction:true};
        break;
      case 59:
        card = {execute:changeAllPos, ...card, isAction:true};
        break;
      default:
        break;
    }
  }
  console.log(card);
  return card
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
  return mixUpDeck(deck);
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
  d8 =  8, d6 = 8, d12 = 6, d20 = 4,
  kami = 8, genocide = 4, dare = 40, hide = 40,//35-38
  tax25 = 8, tax50 = 4, hideWild = 8, //39-41
  telAdd1 = 4, telAdd2 = 4, telAdd3 = 2, telAdd4 = 2, //42 - 45
  redirect = 8, rulete = 4, communism = 4, gift = 8,
  reset = 4, duelDeal = 4, duelDiscard = 4, duelDD = 2,
  changeAll = 4,changeOne = 6,vudu = 6, gini0 = 6,
  changePos = 4, changeAllPos = 6,
) {
  return [
    8, 8, 8, 8, 8, 8, 8, 8, 8, 8,//0-9
    s2, s4, grenades, kicks, //10-13
    r10, r25, r50, r100,//14-17
    s10, s25, s50, s100,//18-21
    add2, add3, add4,//22-24
    add5, add6, add7,//25-27
    add8, 0 ,add10,//28-30 //? add9 no existe
    d6, d8, d12, d20, //31-34
    kami, genocide, dare, hide, //35-38
    tax25, tax50, hideWild, //39-41
    telAdd1, telAdd2, telAdd3, telAdd4, //42 - 45
    redirect, rulete, communism, gift,//46-49
    reset, duelDeal, duelDiscard, duelDD,//50-53
    changeAll, changeOne, vudu, gini0,//54-57
    changePos, changeAllPos, //58-59
  ];
}