import { Context } from './../interfaces/context.model';
import { Card, Color } from "../interfaces/card.model";
import { v4 as uuidv4 } from 'uuid';

export function createDeck(isFlexProb: number, colors: Color[]): Card[] {
  const deck: Card[] = [];
  for (let colorIndex = 0; colorIndex < colors.length; colorIndex++) {
    const filteredColors = colors.filter(c => c !== colors[colorIndex]);
    const newColors: Color[] = [colors[colorIndex], ...filteredColors];
    for (let index = 0; index < 20; index++) {
      deck.push(createCard(index % 10, isFlexProb, newColors));
    }
  }
  return deck;
}

function createCard(number: number, isFlexProb: number, colors: Color[]): Card {
  let card: Card ={
    number,
    colors: [colors[0]],
    type: 'regular',
    isAction: false,
    isWild: false,
    id: uuidv4(),
  }
  if(Math.random() < isFlexProb){
    card.colors!.push(
      colors.slice(1)[
        Math.floor(Math.random() * (colors.length - 1))
      ]
    );
  }
  return card
}

function playWild(context: Context):Context {
  return context;
}

export function addWild(card: Card): Card{
  const originalPlayCard = card.playCard;
  if(originalPlayCard){
    card.playCard = (context: Context) => {
      const cont = originalPlayCard(context);
      return playWild(cont);
    }
  } else {
    card.playCard = playWild;
  }
  card.isWild = true;
  return card;
}