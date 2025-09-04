import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryProvider } from './providers/QueryProvider'
import { TransitionProvider } from './contexts/TransitionContext'
import HomePage from './pages/HomePage'
import EmailCampaignsList from './pages/EmailCampaignsList'
import EmailDashboard from './pages/EmailDashboard'
import LinkedInDashboard from './pages/LinkedInDashboard'

function App() {
  return (
    <QueryProvider>
      <TransitionProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/email-campaigns" element={<EmailCampaignsList />} />
            <Route path="/email-dashboard/:campaignId" element={<EmailDashboard />} />
            <Route path="/linkedin-dashboard" element={<LinkedInDashboard />} />
            {/* Catch-all route for 404s */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Router>
      </TransitionProvider>
    </QueryProvider>
  )
}

export default App