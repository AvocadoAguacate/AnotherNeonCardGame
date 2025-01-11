import { io, Socket } from 'socket.io-client'
import { MySubject } from '../components/observable';
import { UpdateUI } from '../interfaces/update.model';

export class SocketService {
  public id!:string;
  private socket!: Socket | null;
  private server!:string;

  private turnSubject = new MySubject<number>(-1);
  public turn$ = this.turnSubject;

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
    this.socket!.on('message', (data: UpdateUI)=> {
      if(data.type === 'updateUI'){
        console.log(data);
        if(data.turn){
          this.turnSubject.next(data.turn);
        }
      }
    })
  }
}