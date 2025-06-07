import { io } from "socket.io-client";
import { Decoder, getDecoderStateCallbacks, Reflection } from "@colyseus/schema";
import { GameState } from "./GameState";

// const state = new GameState();
// const decoder = new Decoder(state);

let state: GameState;
let decoder: Decoder<GameState>;

const socket = io("http://localhost:3000");

// Log when connected to server
socket.on("connect", () => console.log("Connected to server"));

socket.on("reflection", (reflection: any) => {
  decoder = Reflection.decode<GameState>(reflection);
  state = decoder.state;

  setupListeners();
});

// Handle the state updates
socket.on("sync", (data: any) => {
  decoder.decode(data);
  console.log("Decoded:", state.toJSON());
});

function setupListeners() {
  // We will use this to listen to state changes
  const $ = getDecoderStateCallbacks(decoder);

  // Listen when a new player joins
  $(state).players.onAdd((player, id) => {
    console.log(`${id} joined!`, player.toJSON());

    // Watch for when they move
    $(player).listen("x", (newX, oldX) => {
      console.log(id, "X moved from", oldX, "to", newX);
    });

    $(player).listen("y", (newY, oldY) => {
      console.log(id, "Y moved from", oldY, "to", newY);
    });

    // React to health changes
    $(player).listen("health", (newHealth, oldHealth) => {
      if (newHealth <= 0) {
        console.log(id, "died!");
      } else {
        console.log(id, "health changed from", oldHealth, "to", newHealth);
      }
    });
  });

  // Listen when a player leaves
  $(state).players.onRemove((player, id) => {
    console.log(`${id} left`);
  });

  // Listen to a property changes
  $(state).listen("round", (newRound) => {
    console.log("Round: ", newRound);
  });

  $(state).listen("status", (newStatus) => {
    console.log("Status: ", newStatus);
  });

}
