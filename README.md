# Full-stack State Sync with Socket.IO 

This example demonstrates how to use [`@colyseus/schema`](https://docs.colyseus.io/state/schema) with Socket.IO for efficient real-time state synchronization.

## Features

- **Easy to Use**: Clean API similar to regular Socket.IO
- **Efficient State Sync**: Only sends what changed, not the entire state
- **Type Safety**: TypeScript support with schema decorators - catches errors at compile time
- **Reactive Callbacks**: Listen to specific property changes

### Limitations

Since `@colyseus/schema` is in-memory and single-threaded, you must treat each Socket.IO server as a single "room". If you're interested in scaling this approach, you can check how to [scale Colyseus applications (without Socket.IO)](https://docs.colyseus.io/deployment/scalability).

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the server**:
   ```bash
   npm start
   ```

3. **Start the client**:
   ```bash
   npm run client
   ```

## How It Works

### Shared Schema Definition (`src/GameState.ts`)
- Defines `Player` and `GameState` classes with `@colyseus/schema` decorators
- Provides type safety and efficient serialization

### Server (`src/server.ts`)
- Uses `Encoder` to track and send only state changes

### Client (`src/client.ts`)
- Uses `Decoder` to apply state updates
- Reactive callbacks respond to specific changes

The result is a robust foundation for real-time multiplayer applications. 

## License

MIT