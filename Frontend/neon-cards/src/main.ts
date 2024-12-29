import { Application, Assets, Sprite } from "pixi.js";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#1099bb", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // Crear y configurar un input HTML
  const playerNameInput = document.createElement("input");
  playerNameInput.type = "text";
  playerNameInput.placeholder = "Enter player name";
  playerNameInput.style.position = "absolute";
  playerNameInput.style.width = "200px";
  playerNameInput.style.padding = "10px";
  playerNameInput.style.borderRadius = "5px";
  playerNameInput.style.border = "1px solid #ccc";
  playerNameInput.style.fontFamily = "'Orbitron', sans-serif";
  playerNameInput.style.fontSize = "16px";
  playerNameInput.style.left = `${app.renderer.width / 2 - 100}px`; // Centrar en el canvas
  playerNameInput.style.top = `${app.renderer.height / 2 + 150}px`; // Posicionarlo debajo del conejo
  document.body.appendChild(playerNameInput);

  // Load the bunny texture
  const texture = await Assets.load("/assets/bunny.png");

  // Create a bunny Sprite
  const bunny = new Sprite(texture);

  // Center the sprite's anchor point
  bunny.anchor.set(0.5);

  // Move the sprite to the center of the screen
  bunny.position.set(app.screen.width / 2, app.screen.height / 2);

  // Add the bunny to the stage
  app.stage.addChild(bunny);

  // Listen for animate update
  app.ticker.add((time) => {
    bunny.rotation += 0.1 * time.deltaTime;
  });

  // Opcional: Manejar el redimensionamiento para ajustar la posición del input
  window.addEventListener("resize", () => {
    const canvasBounds = app.view.getBoundingClientRect(); // Obtener las dimensiones del canvas
    playerNameInput.style.left = `${canvasBounds.left + canvasBounds.width / 2 - 100}px`;
    playerNameInput.style.top = `${canvasBounds.top + canvasBounds.height / 2 + 150}px`;
  });
})();
