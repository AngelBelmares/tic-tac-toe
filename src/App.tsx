import { useState } from 'react'
import { LocalBoard } from './components/LocalBoard'
import { OnlineBoard } from './components/OnlineBoard'

function App () {
  function getRandomString (length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }
  const [isLocalGame, setIsLocalGame] = useState<boolean>(true)
  const [playerID, setPlayerID] = useState<string>('generic User')

  function handleClick () {
    const newIsLocalGame = !isLocalGame
    setIsLocalGame(newIsLocalGame)
    setPlayerID(`${getRandomString(5)}-${getRandomString(5)}`)
  }

  return (
    <>
      <main className='mt-8 h-full w-full flex flex-col justify-center items-center bg-black gap-5'>
        <h1 className='text-3xl text-zinc-200'> Tic-Tac-Toe </h1>
        {isLocalGame
          ? <LocalBoard/>
          : <OnlineBoard
            playerID={playerID}/>}
      </main>
      <aside>
        <button
          className='text-neutral-100 border-2 rounded-sm p-1 text-xl'
          onClick={() => handleClick()}>
            {isLocalGame ? 'Play Online' : 'Play local'}
        </button>
      </aside>
    </>
  )
}

export default App
