import { io, Socket } from 'socket.io-client'
import { MySubject } from '../components/observable';
import { CardUI, chatMessage, messageUI, PlayerUI, UpdateUI } from '../interfaces/update.model';

export class SocketService {
  public id!:string;
  private socket!: Socket | null;
  private server!:string;

  private turnSubject = new MySubject<number>(-1);
  public turn$ = this.turnSubject;
  private handSubject = new MySubject<CardUI[]>([]);
  public hand$ = this.handSubject;
  private lastDiscardSubject = new MySubject<CardUI>({colors:[],id:"", number: -1});
  public lastDiscard$ = this.lastDiscardSubject;
  private playersSubject = new MySubject<PlayerUI[]>([]);
  public players$ = this.playersSubject;
  private deadNumberSubject = new MySubject<number>(25);
  public deadNumber$ = this.deadNumberSubject;
  private chatSubject = new MySubject<chatMessage[]>([]);
  public chat$ = this.chatSubject;

  constructor(nav: (stage:string)=>void){
    if(this.loadData()){
      //TODO reconect logic
      this.connectToServer(this.server);
    } else {
      this.id = "";
      this.socket = null;
      this.server = "";
    }
  }

  send(channel:string, msg:any){
    msg.id = this.id;
    console.log(msg);
    this.socket!.emit(channel, msg);
  }

    // Método para conectarse al servidor
  connectToServer(serverUrl: string): void {
    // Verifica si ya existe una conexión
    if (this.socket) {
      this.disconnect();
    }
    this.socket = io(serverUrl);
    this.socket.on('connect', () => {
      if(this.socket){
        this.id = this.socket.id!;
        this.server = serverUrl;
        console.log(`Conectado al servidor:${serverUrl} con id(${this.id})`);
        this.saveData();
        this.listenMessages();
      }
    });
    this.socket.on('disconnect', () => {
      console.log('Desconectado del servidor');
    });
    this.socket.on('connect_error', (error) => {
      console.error('Error al conectar al servidor:', error);
    });
  }

  private disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      console.log('Conexión cerrada.');
    } else {
      console.warn('No hay conexión activa para cerrar.');
    }
  }

  private saveData(): void {
    localStorage.setItem('playerDataMUGG', JSON.stringify({
      id:this.id,
      server: this.server,
      time: Date.now()
    }));
  }

  public loadData(): boolean {
    const dataString: string | null = localStorage.getItem('playerDataMUGG');
    if (dataString) {
      const data = JSON.parse(dataString);
      if (data.time && (Date.now() - data.time < 3600000)) { 
        this.id = data.id;
        this.server = data.server;
        return true;
      } else {
        console.warn("Los datos han expirado.");
        localStorage.removeItem('playerDataMUGG');
      }
    }
    return false;
  }

  private listenMessages() {
    this.socket!.on('message', (data: messageUI)=> {
      console.log(data);
      switch (data.type) {
        case 'updateUI':
          let update:UpdateUI = data as UpdateUI;
          if(update.turn){
            this.turnSubject.next(update.turn);
          }
          if(update.lastDiscard){
            this.lastDiscardSubject.next(update.lastDiscard);
          }
          if(update.hand){
            this.handSubject.next(update.hand);
          }
          if(update.deadNumber){
            this.deadNumberSubject.next(update.deadNumber);
          }
          if(update.players){
            this.playersSubject.next(update.players);
          }
          break;
        case 'challenge':
          break;
        case 'chat':
          let chatItem: chatMessage = data as chatMessage;
          this.addChat(chatItem);
          break;
        default:
          break;
      }
    });
  }
  
  private addChat(chatItem: chatMessage) {
    const leng = this.chat$.value.length + 1; 
    let newChat: chatMessage[] = [];
    if(leng > 50){
      let diff = leng - 50;
      newChat = this.chat$.value;
      newChat.splice(0, diff);
    }
    newChat.push(chatItem);
    this.chatSubject.next(newChat);
  }
}