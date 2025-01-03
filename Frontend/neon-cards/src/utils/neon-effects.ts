import { glowObject } from '../interfaces/glow.models';
import { GlowFilter, GrayscaleFilter } from "pixi-filters";
import { Filter, Ticker } from "pixi.js";
import { Color } from '../interfaces/message.model'

export const glowFilter = new GlowFilter({
  distance: 15,
  outerStrength: 0, 
  innerStrength: 1,
  color: 0x14feff, 
  quality: 0.5,
});

let pulseDirection = 1;  // 1 para aumento, -1 para disminución
let pulseSpeed = 0.1;    // Velocidad del pulso  

export function basicGlowCallback(this: GlowFilter, ticker: Ticker) {
  // Pulso del resplandor
  this.outerStrength += pulseSpeed * pulseDirection;
  this.innerStrength += pulseSpeed * pulseDirection;
  // Si el "outerStrength" supera un umbral o baja demasiado, invertir la dirección
  if (this.outerStrength >= 5 || this.outerStrength <= 0) {
    pulseDirection *= -1; // Invertir la dirección del pulso
  }
}

export const redGlow = new GlowFilter({
  distance: 15,
  outerStrength: 0, 
  innerStrength: 1,
  color: 0xff0000, 
  quality: 0.5,
});

export const blueGlow = new GlowFilter({
  distance: 15,
  outerStrength: 0, 
  innerStrength: 1,
  color: 0x0000ff, 
  quality: 0.5,
});

export const greenGlow = new GlowFilter({
  distance: 15,
  outerStrength: 0, 
  innerStrength: 1,
  color: 0x00ff00, 
  quality: 0.5,
});

export const yellowGlow = new GlowFilter({
  distance: 15,
  outerStrength: 0, 
  innerStrength: 1,
  color: 0xffff66, 
  quality: 0.5,
});

export const purpleGlow = new GlowFilter({
  distance: 15,
  outerStrength: 0, 
  innerStrength: 1,
  color: 0x9900ff, 
  quality: 0.5,
});

export const noGlowFilter = new GrayscaleFilter();

export function getCardFilter(colors: Color[]):Filter[]{
  let filter: Filter[] = [];
  if(colors.length === 1){
    switch (colors[0]) {
      case 'red':
        filter = [redGlow];
        break;
      case 'blue':
        filter = [blueGlow];
        break;
      case 'purple':
        filter = [purpleGlow];
        break;
      case 'yellow':
        filter = [yellowGlow];
        break;
      case 'green':
        filter = [greenGlow];
        break;
      default:
        filter = [noGlowFilter];
        break;
    } 
  } else {
    if(colors.length === 2){
      //TODO 
      filter = [noGlowFilter];
    } else {
      filter = [noGlowFilter];
    }
  }
  return filter;
}

export function getGlowObjects():glowObject[] {
  const list: glowObject[] = []
  const first: Color[] = ['blue', 'red', 'green', 'yellow', 'purple']; 
  let second: Color[] = ['blue', 'red', 'green', 'yellow', 'purple']; 
  first.forEach(first => {
    console.log(first);
    list.push({
      isActive: false,
      colors: [first],
      glow: getCardFilter([first])[0]
    });
    
    second.forEach(second => {
      if(second !== first){
        list.push({
          isActive: false,
          colors: [first, second],
          glow: getCardFilter([first, second])[0]
        });
      }
    });
    second.splice(0,1); // TODO por el momemnto no son diferente red-blue que blue-red
  })
  return list;
}