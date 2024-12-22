import { Card, Color, PlayPayload } from "../../interfaces/card.model";
import { v4 as uuidv4 } from 'uuid';
import { addWild } from "./WildBuilder";
import { Context } from "../../interfaces/context.model";
import { deal } from "../../Utils";

function createAddCard(isFlexProb: number, colors: Color[]): Card {
  let card: Card = {
    number: 22,
    colors: [colors[0]],
    type: 'chain',
    isAction: true,
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

export function addCards(context: Context, number: number): Context{
  let {chain, turn, players} = context
  if(chain.sum === 0){ //new chain
    context.chain = {
      sum: number,
      members: players.map((_p,i) => {
        return i === turn ? true : false;
      }),
      lastAdd: number 
    }
  } else {
    let remainder = chain.lastAdd - number;
    if(remainder > 0){//is unpaid
      context = deal(context, players[turn].id, remainder);
      console.log(`${players[turn].name} tiene que pagar la diferencia con ${remainder}`);
    }
    context.chain.members[turn] = true;
    context.chain.sum += number;
    context.chain.lastAdd = number;
  }
  return {...context};
}

export function createAdd2(isFlexProb: number, colors: Color[]):Card{
  let card = createAddCard(isFlexProb, colors);
  card.number = 22;
  card.playCard = (c:Context, _payload?: PlayPayload) => addCards(c,2);
  card = addWild(card);
  return card;
}

export function createAdd3(isFlexProb: number, colors: Color[]):Card{
  let card = createAddCard(isFlexProb, colors);
  card.number = 23;
  card.playCard = (c:Context, _payload?: PlayPayload) => addCards(c,3);
  return card;
}

export function createAdd4(isFlexProb: number, colors: Color[]):Card{
  let card = createAddCard(isFlexProb, colors);
  card.number = 24;
  card.playCard = (c:Context, _payload?: PlayPayload) => addCards(c,4);
  card = addWild(card);
  return card;
}

export function createAdd5(isFlexProb: number, colors: Color[]):Card{
  let card = createAddCard(isFlexProb, colors);
  card.number = 25;
  card.playCard = (c:Context, _payload?: PlayPayload) => addCards(c,5);
  return card;
} 

export function createAdd6(isFlexProb: number, colors: Color[]):Card{
  let card = createAddCard(isFlexProb, colors);
  card.number = 26;
  card.playCard = (c:Context, _payload?: PlayPayload) => addCards(c,6);
  card = addWild(card);
  return card;
}

export function createAdd7(isFlexProb: number, colors: Color[]):Card{
  let card = createAddCard(isFlexProb, colors);
  card.number = 27;
  card.playCard = (c:Context, _payload?: PlayPayload) => addCards(c,7);
  return card;
}

export function createAdd8(isFlexProb: number, colors: Color[]):Card{
  let card = createAddCard(isFlexProb, colors);
  card.number = 28;
  card.playCard = (c:Context, _payload?: PlayPayload) => addCards(c,8);
  card = addWild(card);
  return card;
}

export function createAdd10(isFlexProb: number, colors: Color[]):Card{
  let card = createAddCard(isFlexProb, colors);
  card.number = 30;
  card.playCard = (c:Context, _payload?: PlayPayload) => addCards(c,10);
  card = addWild(card);
  return card;
} 