import { Card, Color, PlayPayload } from "./interfaces/card.model";
import { Challenge, Context, Player } from "./interfaces/context.model";
import { CardUI, ChallengeUI, PlayerUI, UpdateUI } from "./interfaces/update.model";

export function deal(context:Context, playerId:string, amount: number): Context {
  if(context.deck.length <= amount){
    context = refill(context);
  }
  let {deck, players, deadlyCounter, alifePlayers} = context;
  let player = players.find(player => player.id === playerId);
  let handNum = player!.hand.length;
  if( handNum > 0　|| handNum < deadlyCounter.deadNumber){
    let newAmount = amount;
    let finalAmount = handNum + amount;
    if(finalAmount >= deadlyCounter.deadNumber){ //death
      let res = finalAmount - deadlyCounter.deadNumber;
      newAmount -= res;
      alifePlayers -=1;
    }
    const dealCards = deck.splice(0, newAmount);
    player!.hand.push(...dealCards);
    updAllOneHandUI(context, playerId);
    return {...context, players, deck, alifePlayers};
  } else {
    return context;
  }
}

function refill(context: Context): Context {
  let {discardDeck, deck} = context;
  const [firstCard, ...restOfDiscard] = discardDeck;
  let shuffledCards = suffleCards(restOfDiscard);
  shuffledCards = resetCards(shuffledCards);
  return {
    ...context,
    deck: [...deck, ...shuffledCards],
    discardDeck: [firstCard],
  };
}

export function suffleCards(deck: Card[]): Card[] {
  deck.forEach((_, i) => {
    const j = Math.floor(Math.random() * deck.length);
    [deck[i], deck[j]] = [deck[j], deck[i]];
  });
  return deck;
}

function resetCards(deck: Card[]): Card[] {
  let colors: Color[] = deck
  .filter(card => card.colors) 
  .flatMap(card => card.colors!); 
  deck.forEach((card) => {
    if(card.isWild){
      card.colors = [];
    }
    if(!card.isWild && card.colors?.length === 0){
      card.colors = [
        colors[
          Math.floor(Math.random() * colors.length)
        ]
      ]
    }
  });
  return deck;
}

export function checkColor(card1: Card, card2:Card): boolean {
  return card1.colors!.some(color => card2.colors!.includes(color));
}

export function discardCard(
context:Context, playerId: string,
cardId: string = '', isUnshift = true, 
notify: boolean = false): Context{
  let {discardDeck, players} = context;
  let player = players.find(p => p.id === playerId);
  const playerInd = players.findIndex(player => player.id === playerId);
  const cardInd = cardId.length > 0 ? 
    player!.hand.findIndex(card => card.id === cardId) : 
    Math.floor(Math.random() * player!.hand.length);
  if(cardInd !== -1){ 
    let [card] = player!.hand.splice(cardInd, 1);
    isUnshift ? discardDeck.unshift(card) : discardDeck.push(card);
    notify ?? updatePlayerUI(context, playerInd, true, false, false);
    return {...context, discardDeck, players};
  } else {
    return context;
  }
  
}

export function discardCards(context:Context, playerId: string, cards: string[]): Context {
  cards.forEach(cardId => {
    context = discardCard(context, playerId, cardId, false);
  });
  const playerInd = context.players
    .findIndex(player => player.id === playerId);
  updatePlayerUI(context,playerInd, true, false, false); //TODO allonehand
  return {...context};
}

export function nextTurn(context: Context):Context{
  let {turn, direction, players, deadlyCounter, alifePlayers} = context;
  if(alifePlayers > 1){
    do {
      turn = (turn + direction + players.length) % players.length;
    } while (players[turn].hand.length >= deadlyCounter.deadNumber
      && players[turn].hand.length < 1
    );
  }
  return {...context, turn};
}

export function updAllOneHandUI(context: Context, one: string):void {
  context.players
    .forEach((player, index) => {
      if(player.id !== one){
        updatePlayerUI(context, index, false , true, true);
      } else {
        updatePlayerUI(context, index, true , true, true);
      }
    }
  );
}
export function updAllUI(context: Context):void {
  context.players
    .forEach((_player, index) => {
      updatePlayerUI(context, index,true, true, true)
    }
  );
}

export function updChallengeUI(context: Context, challlege: Challenge):void {
  let {players} = context;
  players.forEach((player, index) => {
    if(player.id === challlege.challenger
    || player.id === challlege.oponent
    ){
      updatePlayerUI(context, index, true, false, true);
    } else {
      updatePlayerUI(context, index, false, false, true);
    }
  })
}

export function updatePlayerUI(
context: Context, playerInd: number,
updateHand: boolean, updateDeadNum: boolean,
updatePlayers: boolean ,
):void{
  let {players, discardDeck, turn} = context;
  let updateMsg: UpdateUI ={
    lastDiscard: mapCardUI(discardDeck[0]),
    turn,
    type: 'updateUI'
  }
  if(updateHand){
    let handUI: CardUI[] = players[playerInd].hand
      .map(card => mapCardUI(card));
    updateMsg.hand = handUI
  }
  if(updateDeadNum){
    updateMsg.deadNumber = context.deadlyCounter.deadNumber;
  }
  if(updatePlayers){
    updateMsg.players = players.map(pl => mapPlayerUI(pl));
  }
  players[playerInd].socket.emit("message", updateMsg);
}

function mapCardUI(card: Card): CardUI {
  let newCardUI: CardUI = {
    colors: card.colors ?? [],
    id: card.id,
  };
  newCardUI.number = card.number!;
  return newCardUI
}
function mapPlayerUI(player: Player):PlayerUI {
  let newPlayerUI: PlayerUI = {
    name: player.name,
    img: player.img,
    hand: player.hand.length
  }
  return newPlayerUI;
}

export function sendChallenge(players: Player[], challenge: Challenge):void{
  const playerInd = players
    .findIndex(pl => pl.id === challenge.oponent);
  const challengerInd = players
    .findIndex(pl => pl.id === challenge.challenger);
  const msg:ChallengeUI = {
    oponent: challengerInd,
    id: challenge.id,
    type: 'challenge'
  };
  players[playerInd].socket.emit('message',msg);
}

export function resetChain(context:Context): Context{
  context.chain.sum = 0;
  context.chain.members = context.chain.members.map(_m => {
    return false;
  });
  return context;
}

export function fillPayload(
  payload:PlayPayload, color:boolean, target: boolean,
  discardCards: boolean, context:Context
): PlayPayload{
  let {turn} = context;
  let newPay = {...payload};
  if(color){
    let col: Color[] = ['blue', 'red', 'purple', 'yellow', 'green'];
    newPay.wildColor = col[Math.floor(Math.random() * 5)];
  }
  if(target){
    newPay.target = turn;
  }
  if(discardCards){
    newPay.discardCards = ['', ''];
  }
  return newPay;
}