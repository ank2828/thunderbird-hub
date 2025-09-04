import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryProvider } from './providers/QueryProvider'
import HomePage from './pages/HomePage'
import EmailDashboard from './pages/EmailDashboard'
import LinkedInDashboard from './pages/LinkedInDashboard'

function App() {
  return (
    <QueryProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/email-dashboard" element={<EmailDashboard />} />
          <Route path="/linkedin-dashboard" element={<LinkedInDashboard />} />
        </Routes>
      </Router>
    </QueryProvider>
  )
}

export default App