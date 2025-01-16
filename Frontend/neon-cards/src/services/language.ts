import { chatMessage, PlayerUI } from "../interfaces/update.model";

export class LanguageService {
  private currentLanguage: string; 
  private translations: Record<string, Record<string, string>>;
  private chats: Record<string, Record<number, string>>;
  constructor(){
    this.currentLanguage = 'es';
    this.translations = {
      en: {
        IP_SERVER: "Enter the server IP",
        CONNECT: "Connect",
        NAME: "Enter your name",
        STATE: "State:",
        READY: "Ready",
        NOTREADY: "Not Ready",
        RUNAWAY: "Run Away",
        c10TITLE: "Halfway",
        c10DETAIL: "The player discards half of their cards and chooses a color",
        c11TITLE: "1/4",
        c11DETAIL: "The player discards a quarter of their cards",
        c12TITLE: "Grenade",
        c12DETAIL: "The player who plays this card, as well as those next to them, draw a random number of cards (up to 12)",
        c13TITLE: "Punch",
        c13DETAIL: "All players with 1 card will draw 4 cards; if none, all players with less than 6 cards will draw 2 cards. If none, the player who played this card must draw 5 cards",
        c14TITLE: "Direction Change lv1",
        c14DETAIL: "The game changes direction, and you are protected from 10% of the chain if it exists. Does not end the chain",
        c15TITLE: "Direction Change lv2",
        c15DETAIL: "The game changes direction, and you are protected from 25% of the chain if it exists. Does not end the chain",
        c16TITLE: "Direction Change lv3",
        c16DETAIL: "The game changes direction, and you are protected from 50% of the chain if it exists. Does not end the chain",
        c17TITLE: "Direction Change lv4",
        c17DETAIL: "The game changes direction, and you are protected from 100% of the chain if it exists. Ends the chain",
        c18TITLE: "Dodge lv1",
        c18DETAIL: "The next player loses their turn, and you are protected from 10% of the chain if it exists. Does not end the chain",
        c19TITLE: "Dodge lv2",
        c19DETAIL: "The next player loses their turn, and you are protected from 25% of the chain if it exists. Does not end the chain",
        c20TITLE: "Dodge lv3",
        c20DETAIL: "The next player loses their turn, and you are protected from 50% of the chain if it exists. Does not end the chain",
      },
      es: {
        IP_SERVER: "Ingresa el ip del server",
        CONNECT: "Conectarse",
        NAME: "Ingresa tu nombre",
        STATE: "Estado:",
        READY: "Listo",
        NOTREADY: "No listo",
        RUNAWAY: "Huir",
        c10TITLE: "A la mitad",
        c10DETAIL: "El jugador descarta la mitad de sus cartas y escoge color",
        c11TITLE: "1/4",
        c11DETAIL: "El jugador descarta una cuarta parte de sus cartas",
        c12TITLE: "Granada",
        c12DETAIL:"El que juegue esta carta como los que estén a la par, toman una cantidad de cartas aleatoria ( max 12 )",
        c13TITLE:"Pichazo",
        c13DETAIL:"Todos los jugadores con 1 carta tomarán 4 cuartas, en caso de que no existan todos los jugadores con menos de 6 cartas tomarán 2 cartas, en caso de que no existan el jugador que juegue esta carta deberá tomar 5 cartas",
        c14TITLE:"Cambiando dirección lv1",
        c14DETAIL:"El juego cambia de dirección y te proteges del 10% de la cadena en caso de existir, no termina la cadena",
        c15TITLE:"Cambiando dirección lv2",
        c15DETAIL:"El juego cambia de dirección y te proteges del 25% de la cadena en caso de existir, no termina la cadena",
        c16TITLE:"Cambiando dirección lv3",
        c16DETAIL:"El juego cambia de dirección y te proteges del 50% de la cadena en caso de existir, no termina la cadena",
        c17TITLE:"Cambiando dirección lv4",
        c17DETAIL:"El juego cambia de dirección y te proteges del 100% de la cadena en caso de existir, termina la cadena",
        c18TITLE:"Esquivar lv1",
        c18DETAIL:"El siguiente jugador pierde su turno y te proteges del 10% de la cadena en caso de existir, no termina la cadena",
        c19TITLE:"Esquivar lv2",
        c19DETAIL:"El siguiente jugador pierde su turno y te proteges del 25% de la cadena en caso de existir, no termina la cadena",
        c20TITLE:"Esquivar lv3",
        c20DETAIL:"El siguiente jugador pierde su turno y te proteges del 50% de la cadena en caso de existir, no termina la cadena",
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