import { Context } from "./interfaces/context.model";

export function deal(context:Context, playerId:string, amount: number): Context {
  let {deck, players} = context;
  const dealCards = deck.splice(0, amount);
  players.find(player => player.id === playerId)!.hand.push(...dealCards);
  return {...context, players, deck};
}