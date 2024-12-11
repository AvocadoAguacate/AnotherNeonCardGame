import { Card, Color, PlayPayload } from "../../interfaces/card.model";
import { Context } from "../../interfaces/context.model";
import { deal, resetChain } from "../../Utils";
import { createCard } from "../CardBuilder";
import { addWild } from "./WildBuilder";

export function createKami(isFlex: number, colors: Color[]):Card{
  let card = createCard(35,isFlex, colors);
  card.type = 'chain';
  card.playCard = (c: Context, _p?: PlayPayload) => kami(c);
  if(Math.random() > 0.3) card = addWild(card);
  return card;
}

export function kami(context:Context): Context {
  let {chain, players} = context;
  chain.members.forEach((isMember, ind) => {
    if(isMember){
      context = deal(context, players[ind].id, chain.sum);
    }
  });
  return resetChain(context);
}