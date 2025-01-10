import { Application, Assets, Sprite } from "pixi.js";
import {LanguageService} from './services/language'
import { showMenu } from "./stages/menu";
import { showWaiting } from "./stages/waitingRoom";
import { showGame } from "./stages/game";
import { SocketService } from "./services/socket";
import { GameService } from "./services/game";
import { NeonService } from "./services/neon";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#000a14", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const socketService = new SocketService(navigate);
  const gameService = new GameService();
  const langService = new LanguageService();
  const neonService = new NeonService(app.ticker);
  // socketService.connectToServer("http://localhost:3000");

  function navigate(stage: string) {
    switch (stage) {
      case "menu":
        showMenu(app, socketService, gameService, langService, navigate);
        break;
      case "waiting-room":
        showWaiting(app, socketService, gameService, langService, navigate, neonService);
        break;
      case "game":
        showGame(app, socketService, gameService, langService, navigate, neonService);
        break;
      default:
        showMenu(app, socketService, gameService, langService, navigate);
        break;
    }
  }

  navigate("menu");
})();
