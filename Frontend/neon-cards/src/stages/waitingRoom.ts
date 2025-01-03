import { Application, Container, Graphics, Text } from "pixi.js";
import { LanguageService } from "../services/language";
import { SocketService } from "../services/socket";
import { GameService } from "../services/game";
import { glowFilter, basicGlowCallback, noGlowFilter, getGlowObjects } from "../utils/neon-effects";
import { createCard } from "../components/card";

export async function showWaiting(
  app: Application, socket: SocketService, game: GameService,
  lang: LanguageService, navigate: (stage:string) => void
) {
  // Limpia el stage
  app.stage.removeChildren();
  const width = app.renderer.width;
  const height = app.renderer.height

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
  // Buttons
  const readyBtnContainer = new Container();
  const readyTxt = new Text({
    text: "Estado: No listo",
    style:{
      fontFamily: 'Orbitron',
      fontSize: 24,
      fill: 0x14feff,
      align: 'center',
    },
  });
  const readyBg = new Graphics()
  readyBg.roundRect(-10, -10, width/2, 50, 5);
  readyBg.stroke({
    color: 0x14feff,
    width: 1,
    alignment: 0.5
  });
  readyBg.fill({
    color: 0x000a14
  })
  readyTxt.x = readyBg.width/2 - readyTxt.width/2
  readyBtnContainer.addChild(readyBg);
  readyBtnContainer.addChild(readyTxt);
  readyBtnContainer.position.set(width/2, height - 50);
  readyBtnContainer.filters = [noGlowFilter];
  readyBtnContainer.eventMode = 'static';
  let ready = false;
  readyBtnContainer.on('mousedown', () => {
    if(ready){
      readyTxt.text = "Estado: No listo";
      app.ticker.remove(basicGlowCallback,glowFilter);
      readyBtnContainer.filters = [noGlowFilter];
      ready = false;
    } else {
      readyTxt.text = "Estado: Listo";
      readyBtnContainer.filters = [glowFilter];
      app.ticker.add(basicGlowCallback, glowFilter);
      ready = true;
    }
    socket.send('message', game.getReadyPlayerMsg(ready));
  });
  const runAwayBtnContainer = new Container();
  const runAwayTxt = new Text({
    text: "Huir",
    style:{
      fontFamily: 'Orbitron',
      fontSize: 24,
      fill: 0x14feff,
      align: 'center',
    },
  });
  const runAwayBg = new Graphics()
  runAwayBg.roundRect(-10, -10, width/2, 50, 5);
  runAwayBg.stroke({
    color: 0x14feff,
    width: 1,
    alignment: 0.5
  });
  runAwayBg.fill({
    color: 0x000a14
  })
  runAwayTxt.x = runAwayBg.width/2 - runAwayTxt.width/2
  runAwayBtnContainer.addChild(runAwayBg);
  runAwayBtnContainer.addChild(runAwayTxt);
  runAwayBtnContainer.position.set(0, height - 50);
  runAwayBtnContainer.filters = [noGlowFilter];
  runAwayBtnContainer.eventMode = 'static';
  runAwayBtnContainer.on('mousedown', () => {
    navigate('menu');
    socket.send('message', game.getLogOutMsg());
  });
  app.stage.addChild(runAwayBtnContainer);
  app.stage.addChild(readyBtnContainer);
}