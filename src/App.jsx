import { Routes, Route } from 'react-router-dom'
import SubjectListPage from './pages/SubjectListPage'
import LoginPage from './pages/LoginPage'

function App() {
  return (
    <div className="min-h-screen w-full bg-gray-100">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/subject-list" element={<SubjectListPage />} />
      </Routes>
    </div>
  )
}

export default App
