import { Card, PlayPayload } from "../../interfaces/card.model";
import { Context } from "../../interfaces/context.model";
import { updPlayersUI } from "../../UpdateUser";
import { checkColor, discardCard, fillPayload } from "../../Utils";
import { createCard } from "../CardBuilder";
import { addWild } from "./WildBuilder";

export function createGeno():Card{
  let card = createCard(36, -1, ['None']);
  card.isAction = true;
  card.playCard = (c: Context, p?: PlayPayload) => geno(c, p!);
  card = addWild(card);
  return card;
}

function geno(context: Context, payload:PlayPayload):Context {
  let {players} = context;
  if(payload?.wildColor){
    payload = fillPayload(payload, true, false, false, context);
  }
  let {wildColor} = payload;
  const color = createCard(1, -1, [wildColor!]);
  players.forEach((player, pInd) => {
    player.hand.forEach((card, cInd) => {
      if(checkColor(card, color)){
        context = discardCard(
          context,
          players[pInd].id, 
          players[pInd].hand[cInd].id,
          false
        );
      }
    });
  });
  updPlayersUI(
    context, false,
    false, true, false,
    true, false, false
  );
  return context
}