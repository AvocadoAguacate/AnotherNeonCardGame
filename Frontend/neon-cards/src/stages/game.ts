import { Application, Text } from "pixi.js";
import { LanguageService } from "../services/language";
import { SocketService } from "../services/socket";
import { GameService } from "../services/game";
import { NeonService } from "../services/neon";

export function showGame(
app: Application, socket: SocketService, game: GameService, 
lang: LanguageService, navigate: (stage: string) => void, 
neon: NeonService) {
  // Limpia el stage
  app.stage.removeChildren();

  socket.turn$.subscribe((turn: number) => {
    if(turn === -1){
      navigate('waiting-room');
    }
  });
}