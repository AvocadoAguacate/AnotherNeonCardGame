import { Application, Text, Graphics } from "pixi.js";
import { LanguageService } from "../services/language";
import { SocketService } from "../services/socket";
import { GameService } from "../services/game";

export function showGame(
  app: Application, socket: SocketService, game: GameService,
  lang: LanguageService, navigate: (stage:string) => void
) {
  // Limpia el stage
  app.stage.removeChildren();

  const title = new Text({
    text: 'Game working!',
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
}