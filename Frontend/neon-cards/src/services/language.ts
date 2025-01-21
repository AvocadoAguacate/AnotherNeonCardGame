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
        c21TITLE: "Dodge lv4",
        c21DETAIL: "The next player loses their turn, and you are protected from 100% of the chain if it exists. Ends the chain",
        c22TITLE: "Draw 2 Cards",
        c22DETAIL: "",
        c23TITLE: "Draw 3 Cards",
        c23DETAIL: "",
        c24TITLE: "Draw 4 Cards",
        c24DETAIL: "",
        c25TITLE: "Draw 5 Cards",
        c25DETAIL: "",
        c26TITLE: "Draw 6 Cards",
        c26DETAIL: "",
        c27TITLE: "Draw 7 Cards",
        c27DETAIL: "",
        c28TITLE: "Draw 8 Cards",
        c28DETAIL: "",
        c30TITLE: "Draw 10 Cards",
        c30DETAIL: "",
        c31TITLE: "Draw a d6 Die",
        c31DETAIL: "Roll a die, and the result will be added to the chain",
        c32TITLE: "Draw an Octahedron Die",
        c32DETAIL: "Roll an octahedron die, and the result will be added to the chain",
        c33TITLE: "Draw a Dodecahedron Die",
        c33DETAIL: "Roll a dodecahedron die, and the result will be added to the chain",
        c34TITLE: "Draw an Icosahedron Die",
        c34DETAIL: "Roll an icosahedron die, and the result will be added to the chain",
        c35TITLE: "Kamikaze",
        c35DETAIL: "All participants in a chain, including the player of this card, receive the total cards in the chain",
        c36TITLE: "Genocide",
        c36DETAIL: "The player chooses a color, and ALL cards of that color will be discarded, regardless of who holds them",
      },
      es: {
        IP_SERVER: "Ingresa el ip del server",
        CONNECT: "Conectarse",
        NAME: "Ingresa tu nombre",
        STATE: "Estado:",
        READY: "Listo",
        NOTREADY: "No listo",
        RUNAWAY: "Huir",
        INTROBASIC: "Juega una carta que coincida en color o símbolo con la que está en juego. Si una carta tiene dos colores, ambos estarán disponibles para el próximo turno. Este juego no está de tu lado, y todos podrían perder.",
        INTRODEATH: "Hay un máximo de cartas que podrás tener en la mano para evitar perder, y este límite se reduce con el tiempo. Otros jugadores pueden quitarte cartas, y quedarte sin ninguna también te elimina. Eres libre de tomar todas las cartas que quieras en cualquier momento. Si juegas una carta que no es válida o si se acaba el tiempo de tu turno sin jugar, deberás tomar una carta como castigo.",
        INTROWIN: "Hay dos formas de ganar. La forma miserable es jugar tu última carta, diferente a descartar todas por el efecto de una carta. La forma correcta de ganar es ser el último sobreviviente, si logras llegar hasta ahí.",
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
        c21TITLE:"Esquivar lv4",
        c21DETAIL:"El siguiente jugador pierde su turno y te proteges del 100% de la cadena en caso de existir, termina la cadena",
        c22TITLE:"Come 2 cartas",
        c22DETAIL:"",
        c23TITLE:"Come 3 cartas",
        c23DETAIL:"",
        c24TITLE:"Come 4 cartas",
        c24DETAIL:"",
        c25TITLE:"Come 5 cartas",
        c25DETAIL:"",
        c26TITLE:"Come 6 cartas",
        c26DETAIL:"",
        c27TITLE:"Come 7 cartas",
        c27DETAIL:"",
        c28TITLE:"Come 8 cartas",
        c28DETAIL:"",
        c30TITLE:"Come 10 cartas",
        c30DETAIL:"",
        c31TITLE:"Come un dado d6",
        c31DETAIL:"Lanza un dado y el resultado será agregado a la cadena",
        c32TITLE:"Come un dado octaedro",
        c32DETAIL:"Lanza un dado octaedro y el resultado será agregado a la cadena",
        c33TITLE:"Come un dado dodecaedro",
        c33DETAIL:"Lanza un dado dodecaedro y el resultado será agregado a la cadena",
        c34TITLE:"Come un dado icosaedro",
        c34DETAIL:"Lanza un dado icosaedro y el resultado será agregado a la cadena",
        c35TITLE:"Kamikaze",
        c35DETAIL:"Todos los participantes de una cadena, incluyendo el jugador de esta carta, reciben el total de cartas de la cadena",
        c36TITLE:"Genocidio",
        c36DETAIL:"El jugador escoge un color y TODAS las cartas de ese color se descartaran, no importa que jugador las tenga en mano",
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