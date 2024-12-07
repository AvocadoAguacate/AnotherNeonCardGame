import { createDeck } from "./cards/CardBuilder";
import { Challenge, Context } from "./interfaces/context.model";
import { ChallengeMessage, EditPlayerMessage, LuckTryMessage, Message, PlayCardMessage, ReadyMessage } from "./interfaces/message.model";
import { checkColor, deal, discardCard, nextTurn, sendChallenge, updAllUI, updChallengeUI, updAllOneHandUI } from "./Utils";
import { v4 as uuidv4 } from 'uuid';

export class Game {
  private context: Context = {
    players: [],
    chain: {
      sum: 0,
      members: []
    },
    deck: createDeck(0.7,['green', 'red', 'purple', 'yellow']),
    discardDeck: [],
    direction: 1,
    turn: 0,
    deadlyCounter:{
      turns: 25,
      deadNumber: 25,
      speed: 1
    }
  };

  private challengeList: Challenge[] = [];
  
  private readyList: boolean[] = []
  private isGameOn: boolean = false;
  
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
      default:
        console.error(`Unknown message type ${message.type}:`);
        console.log(message);
    }
  }
  
  luckTry(msg: LuckTryMessage):void {
    let {players, turn, chain} = this.context;
    if(chain.sum > 0){
      const diceThrow = Math.floor(Math.random() * 6) + 1;
      if(diceThrow === msg.payload.number){
        this.resetChain(false);
      } else {
        const isOdd = diceThrow % 2 !== 0;
        if(isOdd === msg.payload.isOdd){
          this.resetChain(true);
        }
      }
      this.context = deal(this.context, players[turn].id, chain.sum);
    }
  }

  private resetChain(onlyParity: boolean):void{
    let newSum: number;
    if(onlyParity){
      newSum = Math.floor(this.context.chain.sum / 2);
    } else {
      newSum = 0;
    }
    this.context.chain = {
      sum: newSum,
      members: []
    }
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
    const playerInd = this.context.players
    .findIndex(player => player.id === msg.id);
    const cardInd = this.context.players[playerInd].hand
    .findIndex(card => card.id === msg.payload.cardId);
    if(this.context.chain.sum > 0 && this.context.players[playerInd].hand[cardInd].type !== 'chain'){
      // TODO close chain
    }
    if(this.context.players[playerInd].hand[cardInd]?.number === this.context.discardDeck[0]?.number 
    || checkColor(this.context.players[playerInd].hand[cardInd], this.context.discardDeck[0])){
      this.context = discardCard(this.context, msg.id, msg.payload.cardId, true);
      if(this.context.players[playerInd].hand[cardInd].isAction){
        this.context = this.context.discardDeck[0]!.playCard!(this.context);
      }
    } else {
      if(this.context.players[playerInd].hand[cardInd].isWild){
        this.context = discardCard(this.context, msg.id, msg.payload.cardId, true);
        this.context = this.context.discardDeck[0]!.playCard!(this.context);
      }
      this.context = deal(this.context, msg.id, 1);
    }
    this.context = nextTurn(this.context);
    this.updateDeadlyCounter();
    updAllOneHandUI(this.context, msg.id);
  }

  editPlayer(msg: EditPlayerMessage):void {
    const index = this.context.players.findIndex(player => player.id === msg.id);
    if(index === -1){
      this.context.players.push({
        socket: msg.socket!,
        hand: [],
        name: msg.payload.name!,
        id: msg.id,
        img: msg.payload.img!
      });
      if(this.isGameOn){
        this.readyList.push(true);
        this.context = deal(this.context, msg.id, 10);
      } else {
        this.readyList.push(false);
      }
      //TODO notify new player via Chat
    } else {
      this.context.players[index] = {...this.context.players[index], ...msg.payload};
    }
    console.log(this.context.players);
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
    this.context.players.forEach(player => {
      this.context = deal(this.context, player.id, 7);
      this.firstTurn();
      this.firstCard();
    });
    updAllUI(this.context);
  }

  private updateDeadlyCounter(): void {
    this.context.deadlyCounter.turns -= 1;
    if(this.context.deadlyCounter.turns === 0){
      this.context.deadlyCounter.deadNumber -= 1;
      const newCountDown = Math.floor(
        this.context.deadlyCounter.deadNumber 
        / this.context.deadlyCounter.speed);
      this.context.deadlyCounter.turns = newCountDown > 0 ? newCountDown : 1;
    }
  }

  private firstTurn():void{
    this.context.turn = Math.floor(
      Math.random() * this.context.players.length
    );
  }

  private firstCard():void{
    let index = this.context.deck
      .findIndex(card => card.isAction === false);
    let [card] = this.context.deck.splice(index, 1);
    this.context.discardDeck.unshift(card);
  }
}