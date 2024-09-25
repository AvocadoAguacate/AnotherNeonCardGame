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