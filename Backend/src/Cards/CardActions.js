import { sendHand, deal, closeChain, discardCard, checkColor, inform, discardCards } from '../Utils.js';
import { mixUpDeck } from './CardFactory.js';

// General 

function duel() {
  const throwPlayer = Math.floor(Math.random() * 20);
  const throwOponent = Math.floor(Math.random() * 16);
  return throwPlayer > throwOponent;
}

function telAdd(context, searchColor) {
  let {players} = context;
  let counters = players.map(() => 0);
  players.forEach((player, playerIndex) => {
    player.hand.forEach(card => {
      card.color.forEach(color => {
        if(searchColor === color){
          counters[playerIndex] += 1;
        }
      })
    })
  });
  const maxValue = Math.max(counters);
  const targets = counters
    .map((value, index) => value === maxValue ? index : -1)
    .filter(index => index !== -1);  
  if(targets.length === 1){
    return deal(context, targets[0], 3);
  } else {
    targets.forEach(target => {
      context = deal(context, target, 1);
    });
    return {...context};
  }
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

export function wildColorChange(context) {
  let {payLoad, discardDeck} = context;
  discardDeck[0].color = [payLoad.wildColorChange];
  return {...context, payLoad, discardDeck};
}

function ruleteShot(context, count) {
  const max = count === 1 ? 5 : 4;
  const lucky = Math.floor(Math.random() * max);
  let {players, turnIndex, direction} = context;
  let ruleteIndex = turnIndex;
  for (let index = 0; index < lucky; index++) {
    ruleteIndex = (turnIndex + direction + players.length) % players.length;
    inform('ruleteWin', {saved: players[ruleteIndex]});
  }
  if(count === 1){
    context = deal(context, ruleteIndex + direction, 6);
  } else {
    context = deal(context, ruleteIndex + direction, 3);
    context = deal(context, ruleteIndex + direction + direction, 3);
  }
  inform('ruleteLoser', {lucky, count});
  return {...context};
}
// Specific

export function timeBomb(context) {
  //TODO
}

export function floorIsLava(context) {
  //TODO
}

export function floorIsIce(context) {
  //TODO
}

export function deathCard(context) {
  //TODO
}

export function cureCard(context) {
  //TODO
}

export function nuclearDisarmament(context) {
  //TODO
}

export function nuclearBomb(context) {
  //TODO
}

export function actionsDeal(context) {
  //TODO
}

export function colorless(context) {
  //TODO
}

export function colorChange(context) {
  //TODO
}

export function smallDiscard(context) {
  //TODO
}

export function aquiles(context) {
  //TODO
}

export function spy(context) {
  //TODO
}

export function spyAll(context) {
  //TODO
}

export function changeAllPos(context) {
  let {players} = context;
  players = mixUpDeck(players);
  return {...context, players}
}

export function changePos(context) {
  let {players, payLoad, turnIndex} = context;
  [players[turnIndex], players[payLoad.targetIndex]] = [players[payLoad.targetIndex], players[turnIndex]];
  return {...context, players};
}

export function gini0(context) {
  let {players, deck} = context;
  let array = [];
  players.forEach(player => {
    array.push(...player.hand);
  })
  const res = array.length % players.length;
  if(res > 0){
    const neededCards = players.length - res;
    array.push(...deck.splice(0, neededCards));
  }
  const part = array.length / players.length;
  players.forEach(player => {
    player.hand = array.splice(0, part);
  });
  return {...context, players, deck};
}

export function vudu(context) {
  const {payLoad} = context;
  return deal(context, payLoad.targetIndex, 4);
}

export function duelDeal2(context) {
  const {payLoad, turnIndex} = context;
  return duel() ? deal(context, payLoad.oponentIndex, 2) : deal(context, turnIndex, 2);
}

export function duelDiscard2(context) {
  const {payLoad, turnIndex} = context;
  return duel() ? discardCards(context, payLoad.oponentIndex, 2) : discardCards(context, turnIndex, 2);
}

export function duelDD(context) {
  context = wildColorChange(context);
  const {payLoad, turnIndex} = context;
  const playerWin = duel();
  if(playerWin){
    context = deal(context, payLoad.oponentIndex, 2);
    context = discardCards(context, turnIndex, 2);
  } else {
    context = deal(context, turnIndex, 2);
    context = discardCards(context, payLoad.oponentIndex, 2);
  }
  return {...context};
}

export function reset(context) {
  context = wildColorChange(context);
  let {players, turnIndex} = context;
  const target = players[turnIndex].hand.length;
  for (let index = 0; index < target; index++) {
    context = discardCard(context, turnIndex, 0, false);
  }
  context = deal(context, turnIndex, 7);
  return {...context};
}

export function gift(context) {
  let {players, turnIndex, payLoad} = context;
  const cardIndex = players[turnIndex].hand.findIndex(card => card.id === payLoad.cardIndex);
  let [card] = players[turnIndex].hand.splice(cardIndex, 1);
  players[payLoad.oponentIndex].hand.push(card);
  return {...context, players};
}
export function communism(context){
  let {players, payLoad} = context;
  if(payLoad.communismDeal > 5){
    payLoad.communismDeal = 5;
  }
  if(payLoad.communismDiscard > 5){
    payLoad.communismDiscard = 5;
  }
  players.forEach((player, index) => {
    context = deal(context, index, payLoad.communismDeal);
    context = discardCards(context, index, payLoad.communismDiscard);
  });
  return {...context};
}

export function rulete(context) {
  let {discardDeck} = context;
  let count = 1
  if(discardDeck[1].number === 47){
    count ++;
  }
  return ruleteShot(context, count);
}

export function redirect(context) {
  let {turns, turnIndex, direction, players, payLoad} = context;
  turns[turnIndex] = false;
  turnIndex = (payLoad.objetive - direction + players.length) % players.length;
  return {...context, turns, turnIndex}
}

export function telAdd1(context) {
  return telAdd(context, context.discardDeck[0].color[0]);
}

export function telAdd2(context) {
  context = telAdd(context, context.discardDeck[0].color[0]);
  return telAdd(context, context.discardDeck[0].color[1]);
}

export function telAdd3(context) {
  context = wildColorChange(context);
  context = telAdd(context, context.payLoad.color[0]);
  context = telAdd(context, context.payLoad.color[1]);
  return telAdd(context, context.payLoad.color[2]);
}

export function telAdd4(context) {
  context = wildColorChange(context);
  context = telAdd(context, 'green');
  context = telAdd(context, 'blue');
  context = telAdd(context, 'red');
  return telAdd(context, 'yellow');
}

export function hideWild(context) {
  context = wildColorChange(context);
  let {payLoad, discardCard} = context;
  discardCard[0].number = payLoad.hideWildNumber;
  return {...context, isHide:true, discardCard};
}

export function tax25(context) {
  return tax(context, 0.25);
}

export function tax50(context) {
  context = wildColorChange(context);
  return tax(context, 0.5);
}

export function hide(context) {
  return {...context, isHide:true};
}

export function dare(context) {
  let {discardDeck} = context;
  discardDeck[0].color = [];
  return {...context, discardDeck};
}

export function changeAll(context) {
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

export function changeOne(context) {
  let {payLoad, players, turnIndex} = context
  let temp = [...players[turnIndex].hand];
  players[turnIndex].hand = [...players[payLoad.target].hand];
  players[payLoad.target].hand = temp;
  sendHand(players[turnIndex]);
  sendHand(players[payLoad.target]);
  return {...context, players}
}