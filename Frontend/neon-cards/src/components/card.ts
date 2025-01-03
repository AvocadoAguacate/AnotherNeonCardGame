import { Assets, Container, Graphics, Sprite } from "pixi.js";
import { getCardFilter } from "../utils/neon-effects";
import { Color } from "../interfaces/message.model";

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
  const mainIcon = new Sprite({
    texture: mainIconT,
    width: size[0] * 0.8,
    height: size[1] * 0.8,
    filters: getCardFilter(colors),
    x: size[0] * 0.1,
    y: size[1] * 0.1
  });
  card.addChild(cardBg);
  card.addChild(mainIcon);
  return card;
}