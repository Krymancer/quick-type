
import { MainPage } from './pages/main';
import { WebsocketProvider } from './providers/WebsocketProvider';



function App() {
  return (
    <WebsocketProvider>
      <main className='w-screen h-screen flex justify-center p-4 overflow-none'>
        <MainPage />
      </main>
    </WebsocketProvider>
  )
}

export default App
