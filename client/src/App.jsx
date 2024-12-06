import { Outlet } from 'react-router-dom'
import './App.css'
import './index.css'
import Header from './components/Header.jsx'
import Footer from './components/footer.jsx'
function App(){

  return (
    <>
    <Header/>
    <main className='min-h-[78vh]'>
      <Outlet/>
    </main>
    <Footer/>
    </>
  )
}

export default App
