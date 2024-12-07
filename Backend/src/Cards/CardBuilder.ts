import { Context } from './../interfaces/context.model';
import { Card, Color, PlayPayload } from "../interfaces/card.model";
import { v4 as uuidv4 } from 'uuid';
import { suffleCards } from '../Utils';
import { createAdd10, createAdd2, createAdd3, createAdd4, createAdd5, createAdd6, createAdd7, createAdd8 } from './speficBuilders/AddBuilder';

export function createDeck(isFlexProb: number, colors: Color[], config: number[]): Card[] {
  const deck: Card[] = [];
  for (let colorIndex = 0; colorIndex < colors.length; colorIndex++) {
    const filteredColors = colors.filter(c => c !== colors[colorIndex]);
    const newColors: Color[] = [colors[colorIndex], ...filteredColors];
    for (let index = 0; index < 20; index++) {
      deck.push(createCard(index % 10, isFlexProb, newColors));
    }
  }
  config.forEach((number, type) => {
    for (let index = 0; index < number; index++) {
      let card:Card = createActionCard(type, isFlexProb, colors);
      deck.push(card);
    }
  });
  console.log(deck);
  console.log(deck.length);
  return suffleCards(deck);
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

export function addFunction(
  f1: (c: Context, p?: PlayPayload) => Context,
  f2: (c: Context, p?: PlayPayload) => Context   
): (c: Context, p?: PlayPayload) => Context { 
  return (context: Context, p?: PlayPayload) => {
    const cont = f1(context, p);
    return f2(cont, p);
  }
}

function createActionCard(type: number, isFlex: number, colors:Color[]): Card {
  let card:Card;
  switch (type) {
    case 22:
      card = createAdd2(isFlex, colors);
      break;
    case 23:
      card = createAdd3(isFlex, colors);
      break;
    case 24:
      card = createAdd4(isFlex, colors);
      break;
    case 25:
      card = createAdd5(isFlex, colors);
      break;
    case 26:
      card = createAdd6(isFlex, colors);
      break;
    case 27:
      card = createAdd7(isFlex, colors);
      break;
    case 28:
      card = createAdd8(isFlex, colors);
      break;
    case 30:
      card = createAdd10(isFlex, colors);
      break;
    default:
      card = createAdd2(isFlex, colors);
      break;
  }
  return card;
}
