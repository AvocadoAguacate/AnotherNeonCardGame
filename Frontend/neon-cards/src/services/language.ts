export class LanguageService {
  private currentLanguage: string; 
  private translations: Record<string, Record<string, string>>;

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
      },
    };
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

  getLanguage(): string {
    return this.currentLanguage;
  }
}