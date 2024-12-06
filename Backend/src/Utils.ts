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

export function checkColor(card1: Card, card2:Card): boolean {
  return card1.colors!.some(color => card2.colors!.includes(color));
}

export function discardCard(
context:Context, playerId: string,
cardId: string = '', isUnshift = true): Context{
  let {discardDeck, players} = context;
  const playerInd = players.findIndex(player => player.id === playerId);
  const cardInd = cardId.length > 0 ? 
    players[playerInd].hand.findIndex(card => card.id === cardId) : 
    Math.floor(Math.random() * players[playerInd].hand.length);
  let [card] = players[playerInd].hand.splice(cardInd, 1);
  isUnshift ? discardDeck.unshift(card) : discardDeck.push(card);
  return {...context, discardDeck, players};
}

export function discardCards(context:Context, playerId: string, cards: string[]): Context {
  cards.forEach(cardId => {
    context = discardCard(context, playerId, cardId, false);
  })
  return {...context};
}