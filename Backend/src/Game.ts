import { createDeck } from "./cards/CardBuilder";
import { Card, Color, PlayPayload } from "./interfaces/card.model";
import { Challenge, Context, Player } from "./interfaces/context.model";
import { ChallengeMessage, EditPlayerMessage, LuckTryMessage, Message, PlayCardMessage, ReadyMessage, VoteMessage } from "./interfaces/message.model";
import { PlayerUI } from "./interfaces/update.model";
import { sendChallenge, updAllOneHandUI, updChallengeUI, updHand, updPlayers1Hand, updPlayersUI } from "./UpdateUser";
import { checkColor, deal, discardCard, getPlayer, nextTurn } from "./Utils";
import { v4 as uuidv4 } from 'uuid';

export class Game {
  private deckConfig =[
    0,0,0,0,0,0,0,0,0,0,
    6,4,4,2,6,2,4,5,2,2,
    0,0,6,8,6,8,4,6,4,0,
    4,4,6,4,6,4,4,8,4,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
  ];
  // private deckConfig =[
  //   0,0,0,0,0,0,0,0,0,0, //0-9
  //   1,1,1,1,1,1,1,1,1,1, //10-19
  //   1,1,1,1,1,1,1,1,1,0, //20-29
  //   1,1,1,1,1,1,1,0,0,0, //30-39
  // ];
  private luckyTryDefault: number = 5;
  private deadNumberDefault: number = 25;
  private deadSpeedDefault: number = 1;
  private flexProb: number = 0.7;
  private initialCards: number = 7;

  private context: Context = {
    players: [],
    chain: {
      sum: 0,
      members: [],
      lastAdd: 0
    },
    deck: [],
    discardDeck: [],
    direction: 1,
    turn: 0,
    deadlyCounter:{
      turns: this.deadNumberDefault,
      deadNumber: this.deadNumberDefault,
      speed: this.deadSpeedDefault
    },
    alifePlayers: 0
  };

  private challengeList: Challenge[] = [];
  private readyList: boolean[] = []
  private isGameOn: boolean = false;
  private turnSec: number = 1800;
  private turnTimer: NodeJS.Timeout | null = null;
  private winners: PlayerUI[] = [];
  
  execute(message: Message):void{
    switch (message.type){
      case 'readyPlayer':
        this.readyPlayer(message as ReadyMessage);
        break;
      case 'editPlayer':
        this.editPlayer(message as EditPlayerMessage);
        break;
      case 'playCard':
        this.playCard(message as PlayCardMessage);
        break;
      case 'challenge':
        this.challenge(message as ChallengeMessage);
        break;
      case 'luckTry':
        this.luckTry(message as LuckTryMessage);
        break;
      case 'deal':
        this.deal(message);
        break;
      case 'pass':
        this.pass(message);
        break;
      case 'voteDeck':
        this.voteDeck(message as VoteMessage);
        break;
      default:
        console.error(`Unknown message type ${message.type}:`);
        console.log(message);
    }
  }

  voteDeck(msg: VoteMessage){
    let {isLiked, id} = msg.payload;
    let amount = Math.ceil(Math.random() * 4);
    if(!isLiked && amount > this.deckConfig[id]) {
      amount = this.deckConfig[id];
    }
    amount = isLiked ? amount : amount * -1; 
    this.deckConfig[id] += amount;
    this.ajustVoteDeck(amount, isLiked);
  }

  ajustVoteDeck(amount: number, isLike: boolean){
    const ajust = isLike ? -1 : 1;
    amount = isLike ? amount : amount * -1;
    let ind = 0;
    while(ind < amount){
      let rand = Math.floor(Math.random() * 80);
      if(!isLike || (isLike && this.deckConfig[rand] > 0)){
        this.deckConfig[rand] += ajust;
        ind ++;
      }
    }
  }

  startTurnTimer() {
    if (this.turnTimer) {
      clearTimeout(this.turnTimer);
    }
    this.turnTimer = setTimeout(() => {
      let {players, turn} = this.context;      
      console.log(`Tiempo agotado. Haciendo deal a ${players[turn].name}`);
      this.context = deal(this.context, players[turn].id, 1);
      this.checkFinishGame();
      this.context = nextTurn(this.context);
      this.updateDeadlyCounter();
      updAllOneHandUI(this.context, players[turn]);
      this.startTurnTimer();
    }, this.turnSec * 1000);
  }

  cancelTurnTimer() {
    if (this.turnTimer) {
      clearTimeout(this.turnTimer);
      this.turnTimer = null;
    }
  }

  pass(msg: Message) {
    this.context = deal(this.context, msg.id, 1);
    let {players, turn, chain} = this.context;
    if(players[turn].id === msg.id){
      this.cancelTurnTimer()
      if(chain.sum > 0){
        this.context = deal(this.context, msg.id, chain.sum);
        this.resetChain();
      }
      this.context = nextTurn(this.context);
      updPlayers1Hand(
        this.context, players[turn],
        false, true, false,
        false, false, false
      );
      this.startTurnTimer()
    }
    updPlayers1Hand(
      this.context, getPlayer(players, msg.id)!,
      false, false, false,
      true, false, false
    );
    updHand(this.context, getPlayer(players, msg.id)!);
    this.checkFinishGame();
  }
  
  deal(msg: Message) {
    let {players, deadlyCounter} = this.context;
    let player = players.find(p => p.id === msg.id);
    if(player!.hand.length < deadlyCounter.deadNumber 
      || player!.hand.length > 0
    ){
      this.context = deal(this.context, msg.id, 1);
    }
    updPlayers1Hand(
      this.context, getPlayer(players, msg.id)!,
      false, false, false,
      true, false, false
    );
    console.log(`alife:${this.context.alifePlayers}`);
    this.checkFinishGame();
  }

  luckTry(msg: LuckTryMessage):void {
    let {players, turn, chain} = this.context;
    let player = players[turn];
    if(player.id === msg.id 
      && player.luckytries > 0
      && chain.sum > 0
    ){
      this.cancelTurnTimer();
      const dice = Math.floor(Math.random() * 6);
      if(dice === msg.payload.number){
        this.resetChain();
      } else {
        const isOdd = dice % 2 !== 0;
        if(isOdd === msg.payload.isOdd){
          let newSum = Math.floor(chain.sum/2);
          this.context = deal(this.context,player.id,newSum);
          this.resetChain();
        } else {
          this.context = deal(this.context,player.id,chain.sum);
        }
        this.checkFinishGame();
      }
      this.context.players[turn].luckytries -= 1;
      this.checkFinishGame();
      this.context = nextTurn(this.context);
      updAllOneHandUI(this.context, player);
      this.startTurnTimer();
    } else {
      let ind = players.findIndex(p => p.id === msg.id);
      this.context.players[ind].luckytries -= 1;
    }
  }

  private resetChain():void{
    this.context.chain = {
      sum: 0,
      members: [],
      lastAdd: 0
    }
    updPlayersUI(this.context, false, false, false, false, false, true, false);
  }
  
  challenge(msg: ChallengeMessage):void {
    if(msg.payload.id){
      const challengeInd = this.challengeList
        .findIndex(chal => chal.id === msg.payload.id!);
      let {oponent, challenger} = this.challengeList[challengeInd];
      const oponentTry = Math.floor(Math.random() * 6);
      const challengerTry = Math.floor(Math.random() * 6);
      this.context = deal(
        this.context, 
        challengerTry > oponentTry ? oponent : challenger, 
        1
      );
      updChallengeUI(this.context, this.challengeList[challengeInd]);
      this.challengeList.splice(challengeInd,1);
      this.checkFinishGame();
    }else{
      let {challengerId, oponentInd} = msg.payload;
      const oponentId = this.context.players[oponentInd!].id;
      const newChallenge: Challenge = {
        challenger: challengerId!,
        oponent: oponentId,
        id: uuidv4()
      };
      this.challengeList.push(newChallenge);
      if(this.context.players[oponentInd!].hand.length === 1 
      && Math.random() > 0.65){
        msg.payload.id = newChallenge.id;
        this.challenge(msg);
      } else {
        sendChallenge(this.context.players, newChallenge);
      }
    }
  }

  playCard(msg: PlayCardMessage):void {
    let {chain, players, discardDeck, turn} = this.context;
    let player = players[turn];
    if(player.id === msg.id){
      this.cancelTurnTimer()
      let card = player.hand.find(c => c.id === msg.payload.cardId);
      if(chain.sum > 0 && card && card.type !== 'chain'){
        this.context = deal(this.context, msg.id, chain.sum+1);
        this.resetChain();
      } else {
        if(card && (card.number === discardDeck[0]?.number 
          || checkColor(card, discardDeck[0])
          || this.checkChain(card, discardDeck[0])
          || card?.isWild)
        ){
          if(player.hand.length > 1){ // afoul win
            this.context = discardCard(this.context, msg.id, card!.id, true);
            if(discardDeck[0].isAction){
              let payload: PlayPayload = msg.payload;
              this.context = discardDeck[0].playCard!(this.context, payload);
            }
          } else{
            this.winners.push({
              name: player.name, 
              hand:0, 
              img:player.img
            });
            this.finishGame(true);
          }
        } else { //carta no existe o no jugable
          this.context = deal(this.context, msg.id, 1);
        }
      }
      this.checkFinishGame();
      this.context = nextTurn(this.context);
      this.updateDeadlyCounter();
      updAllOneHandUI(this.context, player);
      this.startTurnTimer();
      console.log(this.context.discardDeck[0]);
    } else {
      //TODO notify not your turn!
    }
  }

  editPlayer(msg: EditPlayerMessage):void {
    let {players} = this.context;
    const index = players.findIndex(player => player.id === msg.id);
    if(index === -1 && players.length < 16){
      this.context.players.push({
        socket: msg.socket!,
        hand: [],
        name: msg.payload.name!,
        id: msg.id,
        img: msg.payload.img!,
        luckytries: this.luckyTryDefault
      });
      if(this.isGameOn){
        this.readyList.push(true);
        let player = getPlayer(this.context.players, msg.id);
        this.initialDeal(player!, true);
        updPlayers1Hand(
          this.context, player!, 
          true, true, true, true, true, true
        );
      } else {
        this.readyList.push(false);
      }
      this.context.alifePlayers += 1;
      //TODO notify new player via Chat
    } else {
      this.context.players[index] = {...players[index], ...msg.payload};
    }
    console.log(`Players lenght: ${players.length}`);
  }

  private readyPlayer(msg: ReadyMessage): void {
    const index = this.context.players.findIndex(player => player.id === msg.id);
    this.readyList[index] = msg.payload.status;
    console.log(this.readyList);
    if(msg.payload.status && !this.isGameOn){
      this.isGameOn = this.readyList.reduce((total, current) => total && current) &&
        this.context.players.length >= 2;
      if(this.isGameOn){
        this.startGame();
      }
    }
  }

  private startGame(): void {
    console.log("Starting a game...");
    this.firstTurn();
    const colors: Color[] = ['green', 'red', 'purple', 'yellow', 'blue'];
    this.context.deck = createDeck(this.flexProb, colors, this.deckConfig);
    this.firstCard();
    console.log(`Antes de repartir, estado del juego: ${this.isGameOn}`);
    this.context.players.forEach((player, index) => {
      this.initialDeal(player);
      this.setLuckyTries(index);
    });
    this.isGameOn = true;
    updPlayersUI(
      this.context, true,
      true, true, true,
      true, false, false
    );
    this.startTurnTimer();
  }

  private setLuckyTries(ind: number){
    this.context.players[ind].luckytries = this.luckyTryDefault;
  }

  private updateDeadlyCounter(): void {
    this.context.deadlyCounter.turns -= 1;
    if(this.context.deadlyCounter.turns === 0){
      this.context.deadlyCounter.deadNumber -= 1;
      const newCountDown = Math.floor(
        this.context.deadlyCounter.deadNumber 
        / this.context.deadlyCounter.speed);
      this.context.deadlyCounter.turns = newCountDown > 0 ? newCountDown : 1;
      if(this.turnSec > 10) this.turnSec -= 1;
      this.context.players.forEach(p =>{
        if(p.hand.length === this.context.deadlyCounter.deadNumber){
          this.context.alifePlayers -= 1
        }
      });
      this.checkFinishGame();
      updPlayersUI(
        this.context, false,
        true, false, true,
        false, false, false
      );
    }
  }

  private firstTurn():void{
    this.context.turn = Math.floor(
      Math.random() * this.context.players.length
    );
  }

  private checkFinishGame(){
    if(this.context.alifePlayers < 2){
      this.finishGame(false);
    }
  }
  
  private finishGame(isWinnerSet:boolean){
    console.log('El juego ha terminado!');
    let {alifePlayers} = this.context;
    if(!isWinnerSet && alifePlayers === 1){
      let {players, deadlyCounter} = this.context;
      for (let ind = 0; ind < players.length; ind++) {
        let handL = players[ind].hand.length;
        if(handL > 0 && handL < deadlyCounter.deadNumber){
          let player = players[ind];
          this.winners.push({
            name: player.name, 
            hand: handL , 
            img:player.img
          });
        }
      }
    }
    //Reset game
    this.context = this.resetContext(this.context);
    this.challengeList = [];
    this.readyList = this.context.players.map(_p => false);
    this.isGameOn = false;
    this.turnSec = 1800;
    updPlayersUI(
      this.context, false, true,
      false, false, false, false,
      false
    );
  }

  private resetContext(context:Context): Context{
    let {players} = context;
    let cleanPlayers: Player[] = players.map(p => {
      p.hand = [];
      p.luckytries = this.luckyTryDefault;
      return p;
    }) 
    let newContext = {
      ...context, 
      players: cleanPlayers,
      turn: -1,
      chain: {
        sum: 0,
        members: [],
        lastAdd: 0
      },
      deck: [],
      discardDeck: [],
      direction: 1,
      deadlyCounter:{
        turns: this.deadNumberDefault,
        deadNumber: this.deadNumberDefault,
        speed: this.deadSpeedDefault
      },
      alifePlayers: players.length
    };
    return newContext;
  }

  private firstCard():void{
    let index = this.context.deck
      .findIndex(card => card.isAction === false);
    let [card] = this.context.deck.splice(index, 1);
    this.context.discardDeck.unshift(card);
  }

  private initialDeal(player: Player, isLate: boolean = false):void {
    let amount = isLate ? this.initialCards + 3 : this.initialCards;
    const dealCards = this.context.deck.splice(0, amount);
    player.hand.push(...dealCards);
  }

  private checkChain(c1: Card, c2: Card): boolean {
    if(c1.type === 'chain' && c2.type === 'chain'){
      return true;
    }
    return false;
  }
}