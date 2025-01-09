import { Ticker } from "pixi.js";
import { getGlowObjects } from "../utils/neon-effects";
import { glowObject } from "../interfaces/glow.models";
import { Color } from "../interfaces/message.model";

export class NeonService {

  private ticler: Ticker
  private neonObjects: glowObject[]
  constructor(tic: Ticker){
    this.ticler = tic;
    this.neonObjects = getGlowObjects();
  }

  private checkToActivate(colors: Color[]){
    const find = this.neonObjects.find(obj => {
      return colors[0] === obj.colors[0];
    });
    if(find){
      if(find.members > 0){
        find.members ++;
      } else {
        this.ticler.add(find.callback);
        find.members = 1;
      }
    }
  }

  private checkToDesActive(colors: Color[]){
    const find = this.neonObjects.find(obj => {
      return colors[0] === obj.colors[0];
    });
    if(find){
      if(find.members > 1){
        find.members --;
      } else { 
        this.ticler.remove(find.callback);
        find.members = 0;
      }
    }
  }
  public checkColor(colors:Color[], toAct: boolean){
    colors.forEach(color => {
      if(toAct){
        this.checkToActivate([color]);
      } else {
        this.checkToDesActive([color]);
      }
    })
  }
}