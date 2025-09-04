import { useNavigate } from 'react-router-dom'

function LinkedInDashboard() {
  const navigate = useNavigate()

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url(/blue_linkedin.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dashboard button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
        style={{ fontSize: '16px' }}
      >
        Dashboard
      </button>
    </div>
  )
}

export default LinkedInDashboard