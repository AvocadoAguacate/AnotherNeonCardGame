import { Application, Text, Graphics } from "pixi.js";
import { LanguageService } from "../services/language";

export function showMenu(
  app: Application, socket: any, game: any,
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
}