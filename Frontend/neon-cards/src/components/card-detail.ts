import { Container, Text } from 'pixi.js';
import { LanguageService } from '../services/language';
import { CardUI } from './../interfaces/update.model';
import { createCard } from './card';
import { ScrollBox } from '@pixi/ui';
export async function createCardDetail(
  card:CardUI, lang:LanguageService, size:number[]
):Promise<Container>{
  const detail = new Container({
    height: size[1] * 1.5,
    width: size[0] * 3.5,
  });  
  const title = new Text({
    text: lang.translate(`c${card.number}TITLE`),
    style:{
      fontFamily:'Orbitron',
      fill: 0xd1d7ff,
      align: 'center',
      wordWrap: true,
      wordWrapWidth: size[0] * 2,
      fontSize:18,
      fontWeight: 'bolder'
    }
  });
  const textDetail = new Text({
    text: lang.translate(`c${card.number}DETAIL`),
    style:{
      fontFamily:'Orbitron',
      fill: 0xd1d7ff,
      align: 'justify',
      wordWrap: true,
      wordWrapWidth: size[0] * 2,
      fontSize:16
    },
  });
  const textContainer = new ScrollBox({
    height: size[1],
    width: size[0] * 2,
    items: [title, textDetail],
    // background: 0xffffff
  });
  title.x = size[0] - title.width /2;
  textContainer.position.set(size[0] * 1.125, 0);
  textContainer.label = `card-detail-text-${card.number}`
  detail.addChild(textContainer);
  const cardContainer = await createCard(card, size);
  detail.addChild(cardContainer);
  return detail;
}
