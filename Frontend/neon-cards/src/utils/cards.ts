import { Texture } from "pixi.js";
import { allTexture, chainTexture, generalTexture, oneTexture, randomTexture } from "./common-textures";

export function getSecondIcon(number:number):Texture {
  let result: Texture = new Texture();
  if((number > 13 && number < 36) || number === 46){
    return chainTexture;
  }
  const ones = [10,11,37,49,50,51,52,53,55,56,58,63,70,71,72,77,80];
  if(ones.findIndex(opt => opt === number) !== -1){
    return oneTexture;
  }
  const generals = [60,61,62,41,47,66,67,68,69];
  if(generals.findIndex(opt => opt === number) !== -1){
    return generalTexture;
  }
  const alls = [13,36,38,39,40,48,54,57,59,64,65,73,75,76,78,79];
  if(alls.findIndex(opt => opt === number) !== -1){
    return allTexture;
  }
  const randoms = [42,43,44,45,74];
  if(randoms.findIndex(opt => opt === number) !== -1){
    return randomTexture;
  }
  return result;
}