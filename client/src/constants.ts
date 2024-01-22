import { Turns } from './types.ts'

export const WINNER_COMBINATIONS = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [2, 4, 6],
  [2, 5, 8],
  [3, 4, 5],
  [6, 7, 8],
  [1, 4, 7]
]

// eslint-disable-next-line no-unused-vars
export const TURNS: { [key in Turns]: Turns } = {
  X: 'X',
  O: 'O'
}

export const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001'
