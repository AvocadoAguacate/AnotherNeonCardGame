import { Context } from './../../interfaces/context.model';
import { Card, Color, PlayPayload } from './../../interfaces/card.model';
import { createCard } from '../CardBuilder';
import { deal } from '../../Utils';

export function createKick(isFlex: number, colors: Color[]):Card {
  let card = createCard(13, isFlex, colors);
  card.isAction = true;
  card.playCard = (c:Context, _p?: PlayPayload) => kick(c);
  return card;
}
function kick(context: Context): Context{
  let {players, turn} = context;
  let oneCard = players.map(player => {
    return player.hand.length === 1 ? true : false
  });
  if(oneCard.length > 0){
    oneCard.forEach((isOne, index) => {
      if(isOne){
        context = deal(context, players[index].id, 4);
      }
    })
  } else {
    let twoCards = players.map(player => {
      return player.hand.length <= 5 ? true : false
    });
    if(twoCards.length > 0){
      twoCards.forEach((isTwo, index) => {
        if(isTwo){
          context = deal(context, players[index].id, 2);
        }
      });
    } else {
      context = deal(context, players[turn].id, 5);
    }
  }
  return context;
}