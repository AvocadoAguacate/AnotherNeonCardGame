import { Application, Container, Graphics, Text } from "pixi.js";
import { LanguageService } from "../services/language";
import { SocketService } from "../services/socket";
import { GameService } from "../services/game";
import { glowFilter, basicGlowCallback } from "../utils/neon-effects";

export function showWaiting(
  app: Application, socket: SocketService, game: GameService,
  lang: LanguageService, navigate: (stage:string) => void
) {
  // Limpia el stage
  app.stage.removeChildren();

  const title = new Text({
    text: 'Waiting Room Working!',
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

  const readyBtnContainer = new Container();
  const readyTxt = new Text({
    text: "Click me !",
    style:{
      fontFamily: 'Orbitron',
      fontSize: 24,
      fill: 0xfffaa0,
      align: 'center'
    }
  });
  // const padding = 10;
  // const textBounds = readyTxt.getBounds(); 
  const readyBg = new Graphics()
  readyBg.roundRect(-10, -10, 150, 50, 5);
  readyBg.stroke({
    color: 0x3366ff,
    width: 1,
    alignment: 0.5
  });
  readyBtnContainer.addChild(readyBg);
  readyBtnContainer.addChild(readyTxt);
  readyBtnContainer.position.set(500, 500);
  readyBtnContainer.filters = [glowFilter];
  readyBtnContainer.eventMode = 'static';
  readyBtnContainer.on('mousedown', () => {
    app.ticker.remove(basicGlowCallback,glowFilter);
  })
  app.stage.addChild(readyBtnContainer);
}