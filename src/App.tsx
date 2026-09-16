import { BrowserRouter, Routes, Route } from 'react-router-dom'

import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminServices from './pages/AdminServices'
import AdminShowcase from './pages/AdminShowcase'
import AdminInquiries from './pages/AdminInquiries'
import AdminBusiness from './pages/AdminBusiness'
import AdminAbout from './pages/AdminAbout'

import Home from './pages/Home'
import Services from './pages/Services'
import Showcase from './pages/Showcase'
import Contact from './pages/Contact'
import About from './pages/About'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/showcase" element={<Showcase />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/showcase" element={<AdminShowcase />} />
          <Route path="/admin/inquiries" element={<AdminInquiries />} />
          <Route path="/admin/business" element={<AdminBusiness />} />
          <Route path="/admin/about" element={<AdminAbout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App