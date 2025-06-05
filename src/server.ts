import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";
import path from "path";
import { GameState, Player } from "./GameState";
import { Encoder } from "@colyseus/schema";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

const state = new GameState();
const encoder = new Encoder(state);

io.on("connection", (socket) => {
    console.log("New player connected:", socket.id, " - is recovered?", socket.recovered);

    const player = new Player();
    player.name = "Anonymous " + socket.id; 
    player.x = Math.random() * 800;
    player.y = Math.random() * 600;

    state.players.set(socket.id, player);

    // Send the full state to new players
    socket.emit("sync", encoder.encodeAll());

    socket.on("disconnect", () => {
        console.log("Player disconnected:", socket.id);
        state.players.delete(socket.id);
        broadcastChanges();
    });
});

function broadcastChanges() {
    const changes = encoder.encode();
    if (changes.byteLength > 0) {
        io.emit("schema", changes);
    }
}

// This is the sweet part - only sends what changed!
setInterval(broadcastChanges, 1000 / 60);

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
}); 