import { Card, Color, PlayPayload } from "../../interfaces/card.model";
import { Context } from "../../interfaces/context.model";
import { createCard } from "../CardBuilder";
import { addCards } from "./AddBuilder";
import { addWild } from "./WildBuilder";

export function createDice(isFlex: number, colors: Color[], n: number):Card{
  let card = createCard(n, isFlex, colors);
  const values = [6, 8, 12, 20];
  card.isAction = true;
  card.type = 'chain'
  card.playCard = (c: Context, _p?: PlayPayload) => dice(c, values[n - 31]);
  if(n >= 33) card = addWild(card);
  return card;
}

function dice(context:Context, max:number):Context {
  let dice = Math.floor(Math.random() * max + 1);
  // TODO send chat dice result
  console.log(`Resultado de dado de ${max} caras: ${dice}`);
  return  addCards(context, dice);
}