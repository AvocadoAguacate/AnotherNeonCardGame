import { Card, Color, PlayPayload } from "../../interfaces/card.model";
import { Context } from "../../interfaces/context.model";
import { addFunction } from "../CardBuilder";

function playWild(context: Context, payload?:PlayPayload):Context {
  let {discardDeck} = context;
  if(payload?.wildColor){
    let col: Color[] = ['blue', 'red', 'purple', 'yellow', 'green'];
    payload.wildColor = col[Math.floor(Math.random() * 5)];
  }
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