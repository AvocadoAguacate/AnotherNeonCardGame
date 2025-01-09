import { glowColor } from './../interfaces/glow.models';
import { glowObject } from '../interfaces/glow.models';
import { GlowFilter, GlowFilterOptions, GrayscaleFilter } from "pixi-filters";
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
let pulseSpeed = 0.075;    // Velocidad del pulso  

export function basicGlowCallback(this: GlowFilter, ticker: Ticker) {
  // Pulso del resplandor
  this.outerStrength += pulseSpeed * pulseDirection;
  this.innerStrength += pulseSpeed * pulseDirection;
  // Si el "outerStrength" supera un umbral o baja demasiado, invertir la dirección
  if (this.outerStrength >= 5 || this.outerStrength <= 0) {
    pulseDirection *= -1; // Invertir la dirección del pulso
  }
}

export function duoGlowCallback(this: glowColor, ticker: Ticker){
  this.glow.outerStrength += pulseSpeed * pulseDirection;
  if (this.glow.outerStrength >= 5 || this.glow.outerStrength <= 0) {
    pulseDirection *= -1; 
    this.glow.outerStrength = Math.max(0, Math.min(5, this.glow.outerStrength)); 
  }
}

const redGlowOptions: GlowFilterOptions = {
  distance: 15,
  outerStrength: 0, 
  innerStrength: 2,
  color: 0xff0000, 
  quality: 0.5,
};
const blueGlowOptions: GlowFilterOptions = {
  distance: 15,
  outerStrength: 0, 
  innerStrength: 2,
  color: 0x0000ff, 
  quality: 0.5,
};
const greenGlowOptions: GlowFilterOptions = {
  distance: 15,
  outerStrength: 0, 
  innerStrength: 2,
  color: 0x00ff00, 
  quality: 0.5,
};
const yellowGlowOptions: GlowFilterOptions = {
  distance: 15,
  outerStrength: 0, 
  innerStrength: 2,
  color: 0xffff66, 
  quality: 0.5,
};
const purpleGlowOptions: GlowFilterOptions = {
  distance: 15,
  outerStrength: 0, 
  innerStrength: 2,
  color: 0x9900ff, 
  quality: 0.5,
};

export const redGlow = new GlowFilter(redGlowOptions);
export const blueGlow = new GlowFilter(blueGlowOptions);
export const greenGlow = new GlowFilter(greenGlowOptions);
export const yellowGlow = new GlowFilter(yellowGlowOptions);
export const purpleGlow = new GlowFilter(purpleGlowOptions);

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
    filter = [noGlowFilter];
  }
  return filter;
}

export function getGlowObjects():glowObject[] {
  const list: glowObject[] = []
  const first: Color[] = ['blue', 'red', 'green', 'yellow', 'purple']; 
  first.forEach(first => {
    const paramCallBackFirst:glowColor = {
      colors: [first],
      glow: getCardFilter([first])[0] as GlowFilter
    }
    list.push({
      colors: [first],
      glow: getCardFilter([first])[0] as GlowFilter,
      members: 0,
      callback: (ticker: Ticker) => {
        duoGlowCallback.call(paramCallBackFirst, ticker);
      }
    });
  });
  return list;
}