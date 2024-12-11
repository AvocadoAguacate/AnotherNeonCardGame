import { Card, Color, PlayPayload } from "../../interfaces/card.model";
import { Context } from "../../interfaces/context.model";
import { deal, resetChain } from "../../Utils";
import { createCard } from "../CardBuilder";
import { addWild } from "./WildBuilder";

export function createReverse(isFlex: number, colors: Color[], n: number):Card{
  let card = createCard(n, isFlex,colors);
  const values = [0.1, 0.25, 0.5, 1];
  card.playCard = (c: Context, _p?: PlayPayload) => {
    return addReverse(c, values[n - 14]);
  };
  card.isAction = true;
  card.type = 'chain';
  if(Math.random() > 0.5){
    card = addWild(card);
  }
  return card;
}

export function defense(context:Context, number:number): Context{
  let {chain, turn, players} = context;
  let total = Math.floor(chain.sum - (chain.sum * number)); 
  if(total === 0) context = resetChain(context);
  return deal(context, players[turn].id, total);
}

function reverse(context:Context): Context {
  let {direction} = context;
  direction *= -1;
  return {...context, direction};
}

function addReverse(context: Context, n: number):Context{
  context = defense(context, n);
  return reverse(context);
}