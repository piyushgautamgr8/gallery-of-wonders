import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default MainLayout
