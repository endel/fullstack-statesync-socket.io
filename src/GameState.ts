// 
// See docs: https://docs.colyseus.io/state/schema
// 

import { schema, MapSchema } from "@colyseus/schema";

export const Player = schema({
    name: "string",
    x: "number",
    y: "number",
    health: "number",
})

export const GameState = schema({
    players: { map: Player, default: new MapSchema<typeof Player>() },
    round: "number",
    status: "string",
})

/*
// ----------------------------------------------------------------------------
// ALTERNATIVE: Using the Schema class with legacy decorators
// ----------------------------------------------------------------------------

import { Schema, type, MapSchema } from "@colyseus/schema";

export class Player extends Schema {
    @type("string") name: string = "";
    @type("number") x: number = 0;
    @type("number") y: number = 0;
    @type("number") health: number = 100;
}

export class GameState extends Schema {
    @type({ map: Player }) players = new MapSchema<Player>();
    @type("number") round: number = 1;
    @type("string") status: string = "waiting";
} 

*/