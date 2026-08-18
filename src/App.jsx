import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ModulePage from './pages/ModulePage.jsx'
import { ProgressProvider } from './context/ProgressContext.jsx'

export default function App() {
  return (
    <ProgressProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/module/:moduleId" element={<ModulePage />} />
          </Route>
        </Routes>
      </HashRouter>
    </ProgressProvider>
  )
}
