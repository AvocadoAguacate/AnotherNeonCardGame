import { Assets, Container, Graphics, Sprite } from "pixi.js";
import { getCardFilter } from "../utils/neon-effects";
import { getSecondIcon } from "../utils/cards";
import { CardUI } from "../interfaces/update.model";

async function createCard(card:CardUI, size:number[]):Promise<Container>{
  let {number, colors} = card;
  const newCard = new Container({
    eventMode: 'static'
  });
  const cardBg = new Graphics();
  cardBg.roundRect(0, 0, size[0], size[1], 5);
  cardBg.stroke({
    color: 0x47475c,
    width: 5,
    alignment: 0.5
  });
  cardBg.fill({
    color: 0x000015
  });
  const mainIconT = await Assets.load(`/assets/Cards/c${number}.svg`);
  const neon = getCardFilter(colors);
  const mainIcon = new Sprite({
    texture: mainIconT,
    width: size[0] * 0.75,
    height: size[1] * 0.75,
    filters: neon,
    x: size[0] * 0.125,
    y: size[1] * 0.2
  });
  newCard.addChild(cardBg);
  newCard.addChild(mainIcon);
  if(number > 9){
    const secondIcon = new Sprite({
      texture: getSecondIcon(number),
      width: size[0] * 0.23,
      height: size[1] * 0.23,
      filters: neon,
      x: size[0] * 0.7,
      y: size[1] * 0.03
    });
    newCard.addChild(secondIcon);
  } else { // center when its only a number
    mainIcon.y = size[1] * 0.125
  }
  return newCard;
}

export { createCard };

//TODO object-fit: contain; (mantener la relación de aspecto)