import { Card, Color, PlayPayload } from "../../interfaces/card.model";
import { Context } from "../../interfaces/context.model";
import { nextTurn } from "../../Utils";
import { createCard } from "../CardBuilder";
import { defense } from "./ReverseBuilder";
import { addWild } from "./WildBuilder";

export function createSkip(isFlex: number, colors: Color[], n: number):Card{
  let card = createCard(n, isFlex,colors);
  const values = [0.1, 0.25, 0.5, 1];
  card.playCard = (c: Context, _p?: PlayPayload) => {
    return addSkip(c, values[n - 18]);
  };
  card.isAction = true;
  card.type = 'chain';
  if(Math.random() > 0.5){
    card = addWild(card);
  }
  return card;
}

function skip(context:Context): Context {
  return nextTurn(context);
}

function addSkip(context: Context, n: number):Context{
  context = defense(context, n);
  return skip(context);
}