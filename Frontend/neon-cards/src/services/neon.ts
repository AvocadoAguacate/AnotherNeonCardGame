import { Ticker } from "pixi.js";
import { basicGlowCallback, duoGlowCallback, getGlowObjects } from "../utils/neon-effects";
import { glowObject } from "../interfaces/glow.models";
import { Color } from "../interfaces/message.model";

export class NeonService {

  private ticler: Ticker
  private neonObjects: glowObject[]
  constructor(tic: Ticker){
    this.ticler = tic;
    this.neonObjects = getGlowObjects();
  }

  public checkToActivate(colors: Color[]){
    const find = this.neonObjects.find(obj => {
      if (colors.length === 2 && obj.colors.length === 2) {
        return (
          (colors[0] === obj.colors[0] && colors[1] === obj.colors[1]) ||
          (colors[0] === obj.colors[1] && colors[1] === obj.colors[0])
        );
      } else if (colors.length === 1 && obj.colors.length === 1) {
        return colors[0] === obj.colors[0];
      }
      return false;
    });
    if(find){
      if(find.members > 0){
        find.members ++;
      } else { 
        if(find.colors.length === 1){
          this.ticler.add(basicGlowCallback, find.glow);
        } else {
          this.ticler.add(duoGlowCallback, find);
        }
      }
    }
  }
}