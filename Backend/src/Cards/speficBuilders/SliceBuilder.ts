import { Card, Color, PlayPayload } from "../../interfaces/card.model";
import { Context } from "../../interfaces/context.model";
import { discardCards } from "../../Utils";
import { createCard } from "../CardBuilder";
import { addWild } from "./WildBuilder";

function slice(context:Context, payLoad: PlayPayload, number: number) {
  let {turn, players} = context;
  let maxDiscard = Math.floor(players[turn].hand.length / number);
  if(payLoad.discardCards!.length > maxDiscard){
    payLoad.discardCards = payLoad.discardCards!.splice(0, maxDiscard);
  }
  return discardCards(context, players[turn].id, payLoad.discardCards!);
}

export function createSlice(isFlex: number, colors:Color[], number: number):Card{
  let card = createCard(10, isFlex, colors);
  card.playCard = (c: Context, p?: PlayPayload) => slice(c, p!, number);
  if(number === 2) card = addWild(card);
  card.isAction = true;
  return card;
}