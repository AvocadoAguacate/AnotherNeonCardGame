import { Application, Assets, Sprite } from "pixi.js";
import {LanguageService} from './services/language'
import { showMenu } from "./stages/menu";
import { showWaiting } from "./stages/waitingRoom";
import { showGame } from "./stages/game";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#000a14", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const socketService = {};
  const gameService = {};
  const langService = new LanguageService();

  function navigate(stage: string) {
    switch (stage) {
      case "menu":
        showMenu(app, socketService, gameService, langService, navigate);
        break;
      case "waiting-room":
        showWaiting(app, socketService, gameService, langService, navigate);
        break;
      case "game":
        showGame(app, socketService, gameService, langService, navigate);
        break;
      default:
        showMenu(app, socketService, gameService, langService, navigate);
        break;
    }
  }

  navigate("menu");
})();
