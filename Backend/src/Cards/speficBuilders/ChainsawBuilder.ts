import { Context } from '../../interfaces/context.model';
import { Card, Color, PlayPayload } from "../../interfaces/card.model";
import { createCard } from "../CardBuilder";
import { discardCards } from '../../Utils';

export function createChainsaw(isFlexProb: number, colors: Color[]): Card {
  let card = createCard(37, isFlexProb, colors);
  card.isAction = true;
  card.playCard = (c: Context, _p?: PlayPayload) => chainsaw(c);
  return card;
}

function chainsaw(context: Context): Context{
  let {players, deadlyCounter, alifePlayers} = context;
  players.forEach(player => {
    let cardsL = player.hand.length
    if(cardsL > 0 && cardsL < deadlyCounter.deadNumber){
      if(cardsL - 5 < 1){
        alifePlayers -= 1
      }
      const dList = ['', '', '', '', ''];
      context = discardCards(context, player.id, dList);
    }
  })
  return {...context, alifePlayers};
}