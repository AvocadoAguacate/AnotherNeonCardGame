import { Card, PlayPayload } from "../../interfaces/card.model";
import { Context } from "../../interfaces/context.model";
import { addFunction } from "../CardBuilder";

function playWild(context: Context, payload?:PlayPayload):Context {
  let {discardDeck} = context;
  console.log(payload);
  discardDeck[0].colors = [payload!.wildColor!];
  return {...context, discardDeck};
}

export function addWild(card: Card): Card{
  const originalPlayCard = card.playCard!;
  card.playCard = addFunction(playWild, originalPlayCard);
  card.isWild = true;
  card.colors = [];
  return card;
}