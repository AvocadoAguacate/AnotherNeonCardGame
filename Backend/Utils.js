export function sendHand(player) {
  let lhand = player.hand.map(card => {
    return {"id": card.id, "number": card.number, "color": card.color}
  });
  player.socket.emit("hand", lhand);
}