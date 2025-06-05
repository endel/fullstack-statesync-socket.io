import { io } from "socket.io-client";
import { Decoder, getDecoderStateCallbacks } from "@colyseus/schema";
import { GameState } from "./GameState";

const state = new GameState();
const decoder = new Decoder(state);

const socket = io("http://localhost:3000");

// Log when connected to server
socket.on("connect", () => console.log("Connected to server"));

// Handle the state updates
socket.on("sync", (data: any) => decoder.decode(data));

// We will use this to listen to state changes
const $ = getDecoderStateCallbacks(decoder);

// Listen when a new player joins
$(state).players.onAdd((player, id) => {
    console.log(`${player.name} joined!`, player.toJSON());
    
    // Watch for when they move
    $(player).listen("x", (newX, oldX) => {
        console.log(player.name, "X moved from", oldX, "to", newX);
    });
    
    $(player).listen("y", (newY, oldY) => {
        console.log(player.name, "Y moved from", oldY, "to", newY);
    });
    
    // React to health changes
    $(player).listen("health", (newHealth, oldHealth) => {
        if (newHealth <= 0) {
            console.log(player.name, "died!");
        } else {
            console.log(player.name, "health changed from", oldHealth, "to", newHealth);
        }
    });
});

// Listen when a player leaves
$(state).players.onRemove((player, id) => {
    console.log(`${player.name} left`);
});

// Listen to a property change
$(state).listen("round", (newRound) => {
    console.log("Round: ", newRound);
});