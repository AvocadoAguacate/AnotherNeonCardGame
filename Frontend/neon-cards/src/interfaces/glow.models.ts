import { GlowFilter } from "pixi-filters";
import { TickerCallback } from "pixi.js";

export interface glowObject {
  colors        :       string[];
  glow          :       GlowFilter;
  members       :       number;
  callback      :       TickerCallback<glowColor>;
}

export interface glowColor {
  glow: GlowFilter;
  colors: string[];
}