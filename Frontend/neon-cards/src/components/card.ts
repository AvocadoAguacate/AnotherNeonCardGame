import { Assets, Container, Graphics, Sprite } from "pixi.js";
import { getCardFilter } from "../utils/neon-effects";
import { Color } from "../interfaces/message.model";
import { getSecondIcon } from "../utils/cards";

export async function createCard(
  number: number, colors: Color[], size: number[]
):Promise<Container> {
  const card = new Container({
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
    x: size[0] * 0.1,
    y: size[1] * 0.2
  });
  card.addChild(cardBg);
  card.addChild(mainIcon);
  if(number > 9){
    const secondIcon = new Sprite({
      texture: getSecondIcon(number),
      width: size[0] * 0.23,
      height: size[1] * 0.23,
      filters: neon,
      x: size[0] * 0.7,
      y: size[1] * 0.03
    });
    card.addChild(secondIcon);
  }
  return card;
}