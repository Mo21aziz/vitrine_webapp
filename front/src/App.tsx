import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from './components/layout/AdminLayout'
import { RequireAuth } from './components/layout/RequireAuth'
import { AuthProvider } from './context/AuthContext'
import { ArticlesPage } from './pages/admin/ArticlesPage'
import { AvisPage } from './pages/admin/AvisPage'
import { MenusPage } from './pages/admin/MenusPage'
import { OverviewPage } from './pages/admin/OverviewPage'
import { PointsDeVentePage } from './pages/admin/PointsDeVentePage'
import { ReclamationsPage } from './pages/admin/ReclamationsPage'
import { ArticlePage } from './pages/ArticlePage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { MenuPage } from './pages/MenuPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public site */}
          <Route path="/" element={<HomePage />} />
          <Route path="/carte/:id" element={<MenuPage />} />
          <Route path="/plat/:id" element={<ArticlePage />} />

          {/* Admin — not linked from the site, reachable only by URL */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<OverviewPage />} />
            <Route path="reclamations" element={<ReclamationsPage />} />
            <Route path="avis" element={<AvisPage />} />
            <Route path="menus" element={<MenusPage />} />
            <Route path="articles" element={<ArticlesPage />} />
            <Route path="adresses" element={<PointsDeVentePage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
