import './App.css'
import { MainLayout } from './layout/MainLayout.jsx'
import { Hero } from './components/Hero.jsx'
import { Login } from './components/Login.jsx'
function App() {

  return (
    <>
      <MainLayout>
        <Hero />
      </MainLayout>
    </>
  )
}

export default App
