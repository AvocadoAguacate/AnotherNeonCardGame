import { Card, Color } from "./interfaces/card.model";
import { Context } from "./interfaces/context.model";

export function deal(context:Context, playerId:string, amount: number): Context {
  if(context.deck.length <= amount){
    context = refill(context);
  }
  let {deck, players} = context;
  const dealCards = deck.splice(0, amount);
  players.find(player => player.id === playerId)!.hand.push(...dealCards);
  return {...context, players, deck};
}

function refill(context: Context): Context {
  let {discardDeck, deck} = context;
  const [firstCard, ...restOfDiscard] = discardDeck;
  let shuffledCards = suffleCards(restOfDiscard);
  shuffledCards = resetCards(shuffledCards);
  return {
    ...context,
    deck: [...deck, ...shuffledCards],
    discardDeck: [firstCard],
  };
}

export function suffleCards(deck: Card[]): Card[] {
  deck.forEach((_, i) => {
    const j = Math.floor(Math.random() * deck.length);
    [deck[i], deck[j]] = [deck[j], deck[i]];
  });
  return deck;
}

function resetCards(deck: Card[]): Card[] {
  let colors: Color[] = deck
  .filter(card => card.colors) 
  .flatMap(card => card.colors!); 
  deck.forEach((card) => {
    if(card.isWild){
      card.colors = [];
    }
    if(!card.isWild && card.colors?.length === 0){
      card.colors = [
        colors[
          Math.floor(Math.random() * colors.length)
        ]
      ]
    }
  });
  return deck;
}
