import { v4 as uuidv4 } from 'uuid';

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
  return card
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