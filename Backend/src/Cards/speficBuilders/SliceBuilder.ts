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
  let card = createCard(number, isFlex, colors);
  card.playCard = (c: Context, p?: PlayPayload) => {
    return slice(c, p!, number === 10 ? 2 : 4);
  }
  if(number === 10) card = addWild(card);
  card.isAction = true;
  return card;
}