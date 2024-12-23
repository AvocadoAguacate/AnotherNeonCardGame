import { Context } from './../../interfaces/context.model';
import { Card, Color, PlayPayload } from "../../interfaces/card.model";
import { createCard } from "../CardBuilder";

export function createDare(isFlexProb: number, colors: Color[]): Card {
  let card = createCard(37, isFlexProb, colors);
  card.isAction = true;
  card.playCard = (c: Context, p?: PlayPayload) => dare(c, p!);
  return card;
}
function dare(context: Context, payload: PlayPayload): Context{
  let {discardDeck} = context;
  let {number} = payload;
  discardDeck[0].colors = [];
  discardDeck[0].number = number!;
  return {...context, discardDeck};
}
