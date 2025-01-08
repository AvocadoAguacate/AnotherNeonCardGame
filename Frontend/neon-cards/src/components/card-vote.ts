import { Container, Sprite } from 'pixi.js';
import { LanguageService } from '../services/language';
import { CardUI } from './../interfaces/update.model';
import { createCardDetail } from './card-detail';
import { ScrollBox } from '@pixi/ui';
import { disLikeTexture, likeTexture } from '../utils/common-textures';
import { getCardFilter } from '../utils/neon-effects';
export async function createCardVote(
card: CardUI, lang: LanguageService, size: number[], 
voter: (number: number, status: boolean) => void
):Promise<Container>{
  const cardVote = await createCardDetail(card, lang, size);
  let text = cardVote.getChildByLabel(`card-detail-text-${card.number}`);
  if(text){
    (text as ScrollBox).height = size[1] / 2 ;
  }
  const dislike = new Sprite({
    texture: disLikeTexture,
    y: size[1] / 2,
    x: (size[0] * 1.125) + (size[0] * 0.25),
    height: size[1] / 2,
    width: size[0] / 2,
    filters: getCardFilter(['red']),
    eventMode: 'static'
  });
  dislike.on('mousedown', () => {
    voter(card.number, false);
  });
  const like = new Sprite({
    texture: likeTexture,
    y: size[1] / 2,
    x: (size[0] * 1.125) + (size[0] * 1.25),
    height: size[1] / 2,
    width: size[0] / 2,
    filters: getCardFilter(['green']),
    eventMode: 'static'
  });
  like.on('mousedown', () => {
    voter(card.number, true);
  });
  cardVote.addChild(dislike);
  cardVote.addChild(like);
  cardVote.label = `card-vote-${card.number}`;
  return cardVote;
}