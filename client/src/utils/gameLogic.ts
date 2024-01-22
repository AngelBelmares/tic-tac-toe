import { BoardState, Turns, Data, Winner } from '../types'
import { WINNER_COMBINATIONS, TURNS } from '../constants'

export function checkForWinner (board: BoardState): Winner {
  const combination = WINNER_COMBINATIONS.find(combination => {
    const [a, b, c] = combination
    if (board[a] === board[b] && board[a] === board[c]) {
      return combination
    }
    return undefined
  })
  if (board.every(square => square !== null && !combination)) {
    return 'none'
  }
  return combination ? board[combination[0]] as Turns : false
}

export const getNewTurn = (currentTurn: Turns): Turns => {
  return (currentTurn === TURNS.X ? TURNS.O : TURNS.X)
}

export const getUpdatedBoard = (index: number, board: BoardState, turn: Turns): BoardState => {
  const newBoard = [...board]
  newBoard[index] = turn
  return newBoard
}

export function getUpdatedData ({ board, turn, index }: Data) {
  const newBoard = getUpdatedBoard(index, board, turn)
  const newTurn = getNewTurn(turn)

  // check if theres a winner or draw
  const newWinner = checkForWinner(newBoard)

  return { newBoard, newTurn, newWinner }
}
