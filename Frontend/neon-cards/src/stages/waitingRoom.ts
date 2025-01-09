import { Application, Container, Graphics, Text } from "pixi.js";
import { LanguageService } from "../services/language";
import { SocketService } from "../services/socket";
import { GameService } from "../services/game";
import { noGlowFilter, getCardFilter } from "../utils/neon-effects";
import { getNewCard } from "../utils/cards";
import { createCardVote } from "../components/card-vote";
import { NeonService } from "../services/neon";
import { CardUI } from "../interfaces/update.model";

export async function showWaiting(
  app: Application, socket: SocketService, game: GameService,
lang: LanguageService, navigate: (stage: string) => void, 
neon: NeonService) {
  // Limpia el stage
  app.stage.removeChildren();
  const width = app.renderer.width;
  const height = app.renderer.height
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
      neon.checkColor(['blue'], false);
      readyBtnContainer.filters = [noGlowFilter];
      readyTxt.style.fill = 0x14feff;
      ready = false;
    } else {
      readyTxt.text = "Estado: Listo";
      readyTxt.style.fill = 0x0000ff;
      readyBtnContainer.filters = getCardFilter(['blue']);
      neon.checkColor(['blue'], true);
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
  // const card = (await createCardDetail(getNewCard(0), lang,[width/6, height/4]));
  const voter = async (number: number, status: boolean) => {
    let msg = game.getVoteMessage(number, status);
    socket.send('message',msg);
    app.stage.getChildByLabel(`card-vote-${number}`)?.destroy();
    let newCard = await createCardVote(getNewCard(number), lang,[width/6, height/4], voter);
    newCard.position.set(10,10);
    app.stage.addChild(newCard);
  }  
  let card = (await createCardVote({number: 78, colors:['blue'], id: ''}, lang,[width/6, height/4], voter));
  card.position.set(10,10);
  neon.checkColor(['red', 'green', 'yellow'], true);
  app.stage.addChild(card);
}