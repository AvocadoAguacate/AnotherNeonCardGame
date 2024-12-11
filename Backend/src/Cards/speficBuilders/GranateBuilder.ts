import { Context } from '../../interfaces/context.model';
import { deal } from '../../Utils';
import { createCard } from '../CardBuilder';
import { Card, PlayPayload } from './../../interfaces/card.model';
import { addWild } from './WildBuilder';


export function createGranate():Card {
  let card = createCard(12,-1,['None']);
  card.playCard = (c: Context, _p?: PlayPayload) => grenate(c);
  card = addWild(card);
  card.isAction = true;
  return card; 
}

export function grenate(context: Context): Context{
  let {turn, direction, players} = context;
  let right = (turn + direction + players.length) % players.length;
  let left = (turn - direction + players.length) % players.length;
  let explotion = Math.ceil(Math.random() * 12 + 1);
  let explotionR = Math.floor(Math.random() * 12 + 1);
  let explotionL = Math.floor(Math.random() * 12 + 1);
  context = deal(context, players[turn].id, explotion);
  context = deal(context, players[left].id, explotionL);
  return deal(context, players[right].id, explotionR);
}