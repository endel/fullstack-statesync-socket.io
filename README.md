# Full-stack State Sync with Socket.IO 

This example demonstrates how to use `@colyseus/schema` with Socket.IO for efficient real-time state synchronization.

## Features

- **Easy to Use**: Clean API similar to regular Socket.IO
- **Efficient State Sync**: Only sends what changed, not the entire state
- **Type Safety**: TypeScript support with schema decorators - catches errors at compile time
- **Reactive Callbacks**: Listen to specific property changes

## Quick Start

1. **Install dependencies** (already done):
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