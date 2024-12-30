import { Application, Text, Assets, Sprite, Texture } from "pixi.js";
import { LanguageService } from "../services/language";
import { SocketService } from "../services/socket";
import { GameService } from "../services/game";
import { avatarPaths } from "../services/avatarPaths";
import { GlowFilter } from "pixi-filters";
import { Message } from "../interfaces/message.model";
export async function showMenu(
  app: Application, socket: SocketService, game: GameService,
  lang: LanguageService, navigate: (stage:string) => void
) {
  const width = app.renderer.width;
  const height = app.renderer.height
  const optionsPic: number[] = chooseRandomPics();
  const glowFilter = new GlowFilter({
    distance: 15,
    outerStrength: 0, 
    innerStrength: 1,
    color: 0x14feff, 
    quality: 0.5,
  });
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
  let pulseDirection = 1;  // 1 para aumento, -1 para disminución
  let pulseSpeed = 0.1;    // Velocidad del pulso 
  app.ticker.add((_delta) => {
    // Pulso del resplandor
    glowFilter.outerStrength += pulseSpeed * pulseDirection;
    glowFilter.innerStrength += pulseSpeed * pulseDirection;
    // Si el "outerStrength" supera un umbral o baja demasiado, invertir la dirección
    if (glowFilter.outerStrength > 5 || glowFilter.outerStrength < 0) {
      pulseDirection *= -1; // Invertir la dirección del pulso
    }
  });
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

  const connectBtn = new Text({
    text: lang.translate('CONNECT'),
    style: {
      fontFamily: 'Orbitron',
      fontSize: 24,
      fill: 0xfa15a0,
      align: 'center',
    }
  });
  connectBtn.anchor.set(0.5);
  connectBtn.x = app.screen.width / 2;
  connectBtn.y = app.screen.height / 2 + 100;
  connectBtn.eventMode = 'static';
  // Navegar al stage de juego
  connectBtn.on("pointerdown", () => {
    socket.connectToServer(menuInput.value);
    setTimeout(() => {
      if (socket.id.length > 0) {
        menuInput.value = "";
        menuInput.placeholder = lang.translate('NAME');
        menuInput.style.top = `${height / 3 }px`;
        connectBtn.destroy();
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
  app.stage.addChild(connectBtn);
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
