import { Application, Text, Assets, Sprite, Texture, Graphics, Container } from "pixi.js";
import { LanguageService } from "../services/language";
import { SocketService } from "../services/socket";
import { GameService } from "../services/game";
import { avatarPaths } from "../services/avatarPaths";
import { GlowFilter } from "pixi-filters";
import { Message } from "../interfaces/message.model";
import { glowFilter, basicGlowCallback } from "../utils/neon-effects";
export async function showMenu(
  app: Application, socket: SocketService, game: GameService,
  lang: LanguageService, navigate: (stage:string) => void
) {
  const width = app.renderer.width;
  const height = app.renderer.height
  app.stage.removeChildren();
  const optionsPic: number[] = chooseRandomPics();
  const profileTex0 = await Assets.load(avatarPaths[optionsPic[0]]);
  const profileTex1 = await Assets.load(avatarPaths[optionsPic[1]]);
  const profileTex2 = await Assets.load(avatarPaths[optionsPic[2]]);
  const textures:Texture[] = [profileTex0, profileTex1, profileTex2];
  const options:Sprite[] = [];
  const xPicCenter = (width/2) - (height/8);
  const picSize = height/4;
  const xPics = [xPicCenter - picSize,xPicCenter ,xPicCenter + picSize];
  textures.forEach((texture, ind) => {
    options.push(new Sprite({
      texture: texture,
      width: picSize,
      height: picSize,
      eventMode: 'static',
      x: xPics[ind],
      y: (height / 2.5)
    }));
  });
  options.forEach((opt, ind) => {
    opt.on("pointerdown", () => {
      selectPic(ind, options, glowFilter);
      let msg = game.getEditPlayerMsg(menuInput.value, optionsPic[ind]);
      sendProfile(msg, navigate, socket);
    });
  })
  app.ticker.add(basicGlowCallback, glowFilter);
  const menuInput = document.createElement("input");
  menuInput.type = "text";
  menuInput.placeholder = lang.translate("IP_SERVER");
  menuInput.style.position = "absolute";
  menuInput.style.width = `${width/5}px`;
  menuInput.style.padding = "10px";
  menuInput.style.borderRadius = "5px";
  menuInput.style.fontFamily = "'Orbitron', sans-serif";
  menuInput.style.fontSize = "large";
  menuInput.style.left = `${(width / 2) - (width / 10)}px`; 
  menuInput.style.top = `${ height/ 2}px`; 
  menuInput.id = "menu-input"; 
  menuInput.value = "localhost:3000"; //TODO delete
  document.body.appendChild(menuInput);

  const connectContainer = new Container();
  const connectBtn = new Text({
    text: lang.translate('CONNECT'),
    style: {
      fontFamily: 'Orbitron',
      fontSize: 24,
      fill: 0xd1d7ff,
      align: 'center',
    }
  });
  connectContainer.eventMode = 'static';
  connectContainer.interactive = true;
  // Navegar al stage de juego
  const connectBg = new Graphics()
  connectBg.roundRect(-10, -10, width/5 + 20, 50, 5); // 20 del padding 10px
  connectBg.stroke({
    color: 0x3366ff,
    width: 2,
    alignment: 0.5
  });
  connectBg.fill({
    color: 0x000a14
  })
  connectBg.filters = [glowFilter];
  connectContainer.addChild(connectBg);
  connectContainer.addChild(connectBtn);
  connectContainer.x = (width / 2) - (width/5)/2 + 10;
  connectContainer.y = app.screen.height / 2 + 100;
  connectContainer.on("pointerdown", () => {
    socket.connectToServer(menuInput.value);
    setTimeout(() => {
      if (socket.id.length > 0) {
        menuInput.value = "";
        menuInput.placeholder = lang.translate('NAME');
        menuInput.style.top = `${height / 3 }px`;
        connectContainer.destroy();
        menuInput.addEventListener('input', () => {
          if(menuInput.value.trim() !== ""){
            addProfileSelect(app, options);
          }
        });
      } else {
        console.error("No se pudo conectar al servidor.");
        alert("Error: No se pudo conectar al servidor. Verifica la IP.");
      }
    }, 100);
  });
  app.stage.addChild(connectContainer);
}

function chooseRandomPics():number[]{
  const selectedAvatars: Set<number> = new Set();
  while (selectedAvatars.size < 3) {
    const randomIndex = Math.floor(Math.random() * avatarPaths.length);
    selectedAvatars.add(randomIndex);
  }
  return Array.from(selectedAvatars); 
}

async function addProfileSelect(app: Application, opts: Sprite[], ){
  opts.forEach(element => {
    app.stage.addChild(element);
  });
}

function selectPic(ind: number, opts: Sprite[], filter: GlowFilter){
  opts.forEach((opt, index) => {
    if(ind === index){
      opt.filters = [filter];
    } else{
      opt.filters = [];
    }
  })
}

function sendProfile(msg: Message, navigate: (stage: string) => void, socket: SocketService) {
  socket.send('message', msg);
  setTimeout(() => {
    const input = document.getElementById("menu-input");
    input!.remove();
    navigate('waiting-room')
  }, 1000);
}

