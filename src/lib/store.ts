// src/lib/store.ts
import { create } from 'zustand'

interface GameState {
  roomId: string | null;
  players: { id: string; tileNumber: number | null }[];
  currentPrompt: string;
  eliminatedTiles: number[];
  gameStatus: 'waiting' | 'playing' | 'finished';
  setRoom: (roomId: string) => void;
  addPlayer: (playerId: string) => void;
  setTile: (playerId: string, tileNumber: number) => void;
  setPrompt: (prompt: string) => void;
  eliminateTiles: (tiles: number[]) => void;
  setGameStatus: (status: 'waiting' | 'playing' | 'finished') => void;
}

export const useGameStore = create<GameState>((set) => ({
  roomId: null,
  players: [],
  currentPrompt: '',
  eliminatedTiles: [],
  gameStatus: 'waiting',
  setRoom: (roomId) => set({ roomId }),
  addPlayer: (playerId) => set((state) => ({
    players: [...state.players, { id: playerId, tileNumber: null }]
  })),
  setTile: (playerId, tileNumber) => set((state) => ({
    players: state.players.map(p => 
      p.id === playerId ? { ...p, tileNumber } : p
    )
  })),
  setPrompt: (prompt) => set({ currentPrompt: prompt }),
  eliminateTiles: (tiles) => set((state) => ({
    eliminatedTiles: [...state.eliminatedTiles, ...tiles]
  })),
  setGameStatus: (status) => set({ gameStatus: status })
}))