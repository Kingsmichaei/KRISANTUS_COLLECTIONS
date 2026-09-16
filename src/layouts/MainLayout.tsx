import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

function MainLayout() {
  return (
    <div>
      <Navbar />

      <main>
        <Outlet />
      </main>

      <footer>
        KRISANTUS COLLECTION
      </footer>
    </div>
  )
}

export default MainLayout