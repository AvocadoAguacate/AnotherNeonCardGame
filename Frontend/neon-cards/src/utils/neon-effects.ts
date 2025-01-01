import { GlowFilter, GrayscaleFilter } from "pixi-filters";
import { Ticker } from "pixi.js";

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

export const noGlowFilter = new GrayscaleFilter();