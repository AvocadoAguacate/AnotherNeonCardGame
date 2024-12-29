import { Application, Text, Graphics } from "pixi.js";
import { LanguageService } from "../services/language";
import { SocketService } from "../services/socket";
import { GameService } from "../services/game";

export function showMenu(
  app: Application, socket: SocketService, game: GameService,
  lang: LanguageService, navigate: (stage:string) => void
) {
  // Limpia el stage
  app.stage.removeChildren();
  const title = new Text({
    text: 'Menu working!',
    style: {
        fontFamily: 'Orbitron',
        fontSize: 24,
    fill: 0xff1010,
    align: 'center',
    }
  });
  title.x = app.screen.width / 2 - title.width / 2;
  title.y = 50;
  app.stage.addChild(title);
  // Botón para jugar
  const playButton = new Text({
    text: 'Play',
    style: {
      fontFamily: 'Orbitron',
      fontSize: 24,
      fill: 0xfa15a0,
      align: 'center',
    }
  });
  playButton.anchor.set(0.5);
  playButton.x = app.screen.width / 2;
  playButton.y = app.screen.height / 2;
  playButton.eventMode = 'static';
  // Navegar al stage de juego
  playButton.on("pointerdown", () => {
    console.log("presionando el botón");
    navigate("game");
  });

  app.stage.addChild(playButton);
}