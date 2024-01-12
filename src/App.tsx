import { Board } from './components/Board'

function App () {
  return (
    <main className='mt-8 h-full w-full flex flex-col justify-center items-center bg-black gap-5'>
      <h1 className='text-3xl text-zinc-200'> Tic-Tac-Toe </h1>
      <Board/>
    </main>
  )
}

export default App
