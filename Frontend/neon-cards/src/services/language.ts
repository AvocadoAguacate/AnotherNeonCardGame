import { chatMessage, PlayerUI } from "../interfaces/update.model";

export class LanguageService {
  private currentLanguage: string; 
  private translations: Record<string, Record<string, string>>;
  private chats: Record<string, Record<number, string>>;
  constructor(){
    this.currentLanguage = 'es';
    this.translations = {
      en: {
        IP_SERVER: "...",
        CONNECT: "Connect",
        NAME: "Enter your name",
        waitingRoom: "Waiting Room",
        gameOver: "Game Over",
        welcome: "Welcome to the Game",
        play: "Play",
        exit: "Exit",
      },
      es: {
        IP_SERVER: "Ingresa el ip del server",
        CONNECT: "Conectarse",
        NAME: "Ingresa tu nombre",
        waitingRoom: "Sala de Espera",
        gameOver: "Fin del Juego",
        welcome: "Bienvenido al Juego",
        play: "Jugar",
        exit: "Salir",
        c10TITLE: "A la mitad",
        c10DETAIL: "El jugador descarta la mitad de sus cartas y escoge color",
      },
    };
    this.chats = {
      es:{
        0: 'Encerio piensas ganar con eso ?',
        1: "acaba de conectarse",
        2: "ha retado a"
      },
      en:{
        0: "Do you really think you're going to win with that?",
        1: "just connected",
        2: "challenge to"
      }
    }
  }

  setLanguage(language: string) {
    if (this.translations[language]) {
      this.currentLanguage = language;
    } else {
      console.warn(`Idioma no soportado: ${language}`);
    }
  }

  translate(key: string): string {
    return (
      this.translations[this.currentLanguage][key] ||
      `Traducción no encontrada: ${key}`
    );
  }

  getChat(msg: chatMessage, players:PlayerUI[]):string{
    let res = "";
    switch (msg.chatType) {
      case 1: // player[0] chatText. 
        res = this.getCase1(msg, players[msg.players[0]]);
        break;
      case 2: // player[0] chatText player[1]. 
        res = this.getCase2(msg, players);
        break;
      default:
        res = this.chats[this.currentLanguage][0];
        break;
    }
    return res;
  }

  getCase1(msg: chatMessage, player: PlayerUI): string{
    let txt = this.chats[this.currentLanguage][msg.case];
    return `${player.name} ${txt}.`;
  }

  getCase2(msg: chatMessage, players:PlayerUI[]):string{
    let txt = this.chats[this.currentLanguage][msg.case];
    let p1 = players[msg.players[0]].name;
    let p2 = players[msg.players[1]].name;
    return `${p1} ${txt} ${p2}.`;
  }

  getLanguage(): string {
    return this.currentLanguage;
  }
}