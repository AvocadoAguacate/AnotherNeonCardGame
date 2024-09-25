export function sendHand(player) {
  let lhand = player.hand.map(card => {
    return {"id": card.id, "number": card.number, "color": card.color}
  });
  player.socket.emit("hand", lhand);
}

export function notifyHands(players, io) {
  let report = players.map(player => player.hand.length);
  io.emit('hands', report);
}

export function deal(context, index, number) {
  let { players, deck } = context;
  let [dealCards] = deck.splice(0, number);
  players[index].hand.push(dealCards);
  sendHand(players[index]);
  return {...context, 'players': players};
}

export function closeChain(context) {
  context = deal(context, context.turnIndex, context.chain.sum);
  return {...context, 'chain': {}};
}