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
const redGlowOptions: GlowFilterOptions = {
  distance: 15,
  outerStrength: 0, 
  innerStrength: 1,
  color: 0xff0000, 
  quality: 0.5,
};
const blueGlowOptions: GlowFilterOptions = {
  distance: 15,
  outerStrength: 0, 
  innerStrength: 1,
  color: 0x0000ff, 
  quality: 0.5,
};
const greenGlowOptions: GlowFilterOptions = {
  distance: 15,
  outerStrength: 0, 
  innerStrength: 1,
  color: 0x00ff00, 
  quality: 0.5,
};
const yellowGlowOptions: GlowFilterOptions = {
  distance: 15,
  outerStrength: 0, 
  innerStrength: 1,
  color: 0xffff66, 
  quality: 0.5,
};
const purpleGlowOptions: GlowFilterOptions = {
  distance: 15,
  outerStrength: 0, 
  innerStrength: 1,
  color: 0x9900ff, 
  quality: 0.5,
};

export const redGlow = new GlowFilter(redGlowOptions);
export const blueGlow = new GlowFilter(blueGlowOptions);
export const greenGlow = new GlowFilter(greenGlowOptions);
export const yellowGlow = new GlowFilter(yellowGlowOptions);
export const purpleGlow = new GlowFilter(purpleGlowOptions);

export const noGlowFilter = new GrayscaleFilter();

export const blueRedFilter = new GlowFilter(blueGlowOptions);
export const blueGreenFilter = new GlowFilter(blueGlowOptions);
export const blueYellowFilter = new GlowFilter(blueGlowOptions);
export const bluePurpleFilter = new GlowFilter(blueGlowOptions);
export const redGreenFilter = new GlowFilter(redGlowOptions);
export const redYellowFilter = new GlowFilter(redGlowOptions);
export const redPurpleFilter = new GlowFilter(redGlowOptions);
export const greenYellowFilter = new GlowFilter(greenGlowOptions);
export const greenPurpleFilter = new GlowFilter(greenGlowOptions);
export const yellowPurpleFilter = new GlowFilter(yellowGlowOptions);

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
      switch (colors[0]) {
        case 'blue':
          switch (colors[1]) {
            case 'red':
              console.log('its redblue')
              filter = [blueRedFilter];
              break;
            case 'green':
              filter = [blueGreenFilter];
              break;
            case 'yellow':
              filter = [blueYellowFilter];
              break;
            case 'purple':
              filter = [bluePurpleFilter];
              break;
            default:
              filter = [blueGlow];
              break;
          }
          break;
        case 'red':
          switch (colors[1]) {
            case 'blue':
              filter = [blueRedFilter];
              break;
            case 'green':
              filter = [redGreenFilter];
              break;
            case 'yellow':
              filter = [redYellowFilter];
              break;
            case 'purple':
              filter = [redPurpleFilter];
              break;
            default:
              filter = [redGlow];
              break;
          }
          break;
        case 'green':
          switch (colors[1]) {
            case 'blue':
              filter = [blueGreenFilter];
              break;
            case 'red': 
              filter = [redGreenFilter];
              break;
            case 'yellow':
              filter = [greenYellowFilter];
              break;
            case 'purple':
              filter = [greenPurpleFilter];
              break;
            default:
              filter = [greenGlow];
              break;
          }
          break;
        case 'yellow':
          switch (colors[1]) {
            case 'blue':
              filter = [blueYellowFilter];
              break;
            case 'red':
              filter = [redYellowFilter];
              break;
            case 'green':
              filter = [greenYellowFilter];
              break;
            case 'purple':
              filter = [yellowPurpleFilter];
              break;
            default:
              filter = [yellowGlow];
              break;
          }
          break;
        case 'purple':
          switch (colors[1]) {
            case 'blue':
              filter = [bluePurpleFilter];
              break;
            case 'red':
              filter = [redPurpleFilter];
              break;
            case 'green':
              filter = [greenPurpleFilter];
              break;
            case 'yellow':
              filter = [yellowPurpleFilter];
              break;              
            default:
              filter = [purpleGlow];
              break;
          }
          break;
        default:
          break;
      }
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
      colors: [first],
      glow: getCardFilter([first])[0],
      members: 0
    });
    
    second.forEach(second => {
      if(second !== first){
        list.push({
          colors: [first, second],
          glow: getCardFilter([first, second])[0],
          members: 0
        });
      }
    });
    second.splice(0,1); // TODO por el momemnto no son diferente red-blue que blue-red
  });
  console.log(list);
  return list;
}