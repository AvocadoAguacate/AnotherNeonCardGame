import { CardUI, ChallengeUI, PlayerUI, UpdateUI } from "./interfaces/update.model";
import { Card} from "./interfaces/card.model";
import { Challenge, Context, Player } from "./interfaces/context.model";

export function updAllOneHandUI(context: Context, one: Player):void {
  context.players
    .forEach((player) => {
      if(player.id !== one.id){
        updatePlayerUI(context, player, true, true, true, true, true, true, true);
      } else {
        updatePlayerUI(context, player, true, true, false, true, true, true, true);
      }
    }
  );
}

export function updPlayers1Hand(
  context: Context, one: Player,
  upLastDiscard: boolean, upTurn: boolean,
  upDeadNum: boolean, upPlayers: boolean, 
  upChain: boolean, upGeneral: boolean
):void {
  context.players
    .forEach((player) => {
      if(player.id === one.id){
        updatePlayerUI(context, player, upLastDiscard, upTurn, true, upDeadNum, upPlayers, upChain, upGeneral);
      } else {
        updatePlayerUI(context, player, upLastDiscard, upTurn, false, upDeadNum, upPlayers, upChain, upGeneral);
      }
    }
  );
}

export function updAllUI(context: Context):void {
  context.players
    .forEach((player) => {
      updatePlayerUI(context, player, true, true, true, true, true, true, true);
    }
  );
}

export function updChallengeUI(context: Context, challlege: Challenge):void {
  let {players} = context;
  players.forEach((player) => {
    if(player.id === challlege.challenger
    || player.id === challlege.oponent
    ){
      updatePlayerUI(context, player, true, true, true, true, true, true, true);
    } else {
      updatePlayerUI(context, player, true, true, false, true, true, true, true);
    }
  })
}

export function updPlayersUI(
  context: Context,
  upLastDiscard: boolean, upTurn: boolean,
  upHand: boolean, upDeadNum: boolean,
  upPlayers: boolean, upChain: boolean,
  upGeneral: boolean
): void{
  let {players} = context;
  players.forEach(p => {
    updatePlayerUI(
      context, p, upLastDiscard,
      upTurn, upHand, upDeadNum, 
      upPlayers, upChain, upGeneral
    );
  })
}

export function updatePlayerUI(
context: Context, player: Player,
upLastDiscard: boolean, upTurn: boolean,
upHand: boolean, upDeadNum: boolean,
upPlayers: boolean, upChain: boolean,
upGeneral: boolean
):void{
  let { players, 
    discardDeck, 
    turn, 
    deadlyCounter,
    chain
  } = context;
  let msg: UpdateUI ={
    type: 'updateUI'
  }
  if(upLastDiscard){
    msg.lastDiscard = mapCardUI(discardDeck[0])
  }
  if(upTurn){
    msg.turn = turn
  }
  if(upHand){
    let handUI: CardUI[] = player.hand
      .map(card => mapCardUI(card));
    console.log(`${player.name} - ${handUI.length} cards`);
    msg.hand = handUI
  }
  if(upDeadNum){
    msg.deadNumber = deadlyCounter.deadNumber;
  }
  if(upPlayers){
    msg.players = players.map(pl => mapPlayerUI(pl));
  }
  if(upChain){
    msg.chain = chain.sum;
  }
  if(upGeneral){
    msg.general = []//TODO general in context 
  }
  player.socket.emit("message", msg);
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

export function updHand(context: Context, player: Player){
  updatePlayerUI(
    context, player,
    false, false, true,
    false, false, false,
    false
  );
}

export function updTurn(context: Context){
  updPlayersUI(
    context,
    false, true, false,
    false, false, false,
    false
  );
}