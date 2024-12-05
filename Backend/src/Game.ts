import { createDeck } from "./cards/CardBuilder";
import { Context } from "./interfaces/context.model";
import { EditPlayerMessage, Message, ReadyMessage } from "./interfaces/message.model";
import { deal } from "./Utils";

export class Game {
  private context: Context = {
    players: [],
    chain: {
      sum: 0,
      members: []
    },
    deck: createDeck(0.5,['green', 'red', 'purple', 'yellow']),
    discardDeck: [],
    direction: 1,
    turn: 0,
    deadlyCounter:{
      turns: 25,
      deadNumber: 25,
      speed: 1
    }
  };
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
      default:
        console.error(`Unknown message type ${message.type}:`);
        console.log(message);
    }
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
    if(msg.payload.status){
      this.isGameOn = this.readyList.reduce((total, current) => total && current) &&
        this.context.players.length >= 2;
      if(this.isGameOn){
        this.startGame();
      }
    }
    console.log(this.readyList);
    console.log(`isGameOn: ${this.isGameOn}`);
  }

  private startGame(): void {
    this.context.players.forEach(player => {
      this.context = deal(this.context, player.id, 7);
      // TODO send start game to every player
      this.updateDeadlyCounter()
    });
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
}