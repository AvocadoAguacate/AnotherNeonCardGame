import { sendHand, deal, closeChain, discardCard, checkColor, inform, discardCards } from '../Utils.js';


// General 

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

function skip(context) {
  let {turns, turnIndex, direction, players} = context;
  turns[turnIndex] = false;
  turnIndex = (turnIndex + direction + players.length) % players.length;
  return {...context, turns, turnIndex};
}

function dice(context, number) {
  let dice = Math.floor(Math.random() * number + 1);
  context = addCards(context, dice);
  return {...context};
}

export function wildColorChange(context) {
  let {payLoad, discardDeck} = context;
  discardDeck[0].color = [payLoad.wildColorChange];
  return {...context, payLoad, discardDeck};
}

export function addCards(context, number) {
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

export function genocide(context) {
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

export function slice2(context) {
  return slice(context, 2);
}

export function slice4(context) {
  context = wildColorChange(context);
  return slice(context, 4);
}

export function grenate(context) {
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

export function kick(context) {
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

export function reverse10(context) {
  if(context.chain.sum){
    context = defense(context, 0.9);
  }
  return reverse(context);
}

export function reverse25(context) {
  if(context.chain.sum){
    context = defense(context, 0.75);
  }
  return reverse(context);
}
export function reverse50(context) {
  if(context.chain.sum){
    context = defense(context, 0.5);
  }
  return reverse(context);
}
export function reverse100(context) {
  if(context.chain.sum){
    context = defense(context, 0);
  }
  return reverse(context);
}

export function skip10(context) {
  if(context.chain.sum){
    context = defense(context, 0.9);
  }
  return skip(context);
}

export function skip25(context) {
  if(context.chain.sum){
    context = defense(context, 0.75);
  }
  return skip(context);
}
export function skip50(context) {
  if(context.chain.sum){
    context = defense(context, 0.5);
  }
  return skip(context);
}
export function skip100(context) {
  if(context.chain.sum){
    context = defense(context, 0);
  }
  return skip(context);
}

export function d8(context) {
  return dice(context, 8);
}
export function d6(context) {
  return dice(context, 6);
}
export function d12(context) {
  context = wildColorChange(context);
  return dice(context, 12);
}
export function d20(context) {
  context = wildColorChange(context);
  return dice(context, 20);
}

export function kami(context) {
  let {chain} = context;
  context = wildColorChange(context);
  chain.members.forEach((isMember, index) => {
    if(isMember){
      context = deal(context, index, chain.sum);
    }
  })
  return {...context, chain:{}};
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

export function add2(context) {
  context = wildColorChange(context);
  return addCards(context, 2);
}

export function add3(context) {
  return addCards(context, 3);
}

export function add4(context) {
  context = wildColorChange(context);
  return addCards(context, 4);
}

export function add5(context) {
  return addCards(context, 5);
}

export function add6(context) {
  context = wildColorChange(context);
  return addCards(context, 6);
}

export function add7(context) {
  return addCards(context, 7);
}

export function add8(context) {
  context = wildColorChange(context);
  return addCards(context, 8);
}

export function add10(context) {
  context = wildColorChange(context);
  return addCards(context, 10);
}