import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";
import path from "path";
import { GameState, Player } from "./GameState";
import { Encoder, Reflection } from "@colyseus/schema";

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

    if (state.players.size >= 2) {
        state.status = "started";
    }

    // Optional: send the reflection of the state to the client
    // (Not required if you are able to instantiate "GameState" direclty from the client)
    socket.emit("reflection", Reflection.encode(encoder));

    // Send the full state to new players
    const full = encoder.encodeAll();
    console.log("> Full state size:", full.byteLength, "bytes");
    socket.emit("sync", Buffer.from(full));

    socket.on("move", (data) => {
        player.x += data.dx;
        player.y += data.dy;
    });

    socket.on("disconnect", () => {
        console.log("Player disconnected:", socket.id);
        state.players.delete(socket.id);
    });
});

function broadcastChanges() {
    // No need to encode and send changes if there are no changes or no clients connected
    if (!encoder.hasChanges || io.sockets.sockets.size === 0) { return; }

    const changes = encoder.encode();
    if (changes.byteLength > 0) {
        console.log("> Broadcasting changes", changes.byteLength, "bytes");
        io.emit("sync", Buffer.from(changes));
    }

    encoder.discardChanges();
}

// This is the sweet part - only sends what changed!
setInterval(broadcastChanges, 1000 / 60);

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});