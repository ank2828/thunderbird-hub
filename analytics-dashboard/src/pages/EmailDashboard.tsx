import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import CampaignOverview from '../components/CampaignOverview'
import { instantlyApi } from '../services/instantly'
import type { CampaignAnalytics } from '../services/instantly'
import { useTransition } from '../contexts/TransitionContext'

function EmailDashboard() {
  const navigate = useNavigate()
  const { completeTransition } = useTransition()
  const [campaignData, setCampaignData] = useState<CampaignAnalytics | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Function to convert status number to readable text
  const getStatusText = (status: number) => {
    switch (status) {
      case 1:
        return { text: 'Running', class: 'bg-green-100 text-green-800' };
      case 2:
        return { text: 'Paused', class: 'bg-yellow-100 text-yellow-800' };
      case 0:
        return { text: 'Draft', class: 'bg-gray-100 text-gray-800' };
      case 3:
        return { text: 'Completed', class: 'bg-blue-100 text-blue-800' };
      default:
        return { text: 'Unknown', class: 'bg-gray-100 text-gray-800' };
    }
  };

  // Handle transition and data loading
  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const campaigns = await instantlyApi.getCampaignAnalytics();
        if (campaigns && campaigns.length > 0) {
          setCampaignData(campaigns[0]);
        }
      } catch (err) {
        console.error('Error fetching campaign data for header:', err);
      }
    };

    // Apple-style: Precise choreography - appear exactly when overlay is ready
    requestAnimationFrame(() => {
      setTimeout(() => {
        setIsVisible(true)
      }, 300) // Synchronized with transition overlay peak
      
      setTimeout(() => {
        completeTransition()
      }, 600) // Clean handoff
    })

    fetchCampaignData();
  }, [completeTransition]);

  const status = campaignData ? getStatusText(campaignData.campaign_status) : { text: 'Loading...', class: 'bg-gray-100 text-gray-800' };

  return (
    <div 
      className="min-h-screen p-8 gpu-accelerated"
      style={{
        background: 'linear-gradient(135deg, #f87171, #fb923c, #f97316)',
        opacity: isVisible ? 1 : 0.3,
        transform: isVisible ? 'scale(1)' : 'scale(1.02)',
        transition: 'opacity 600ms cubic-bezier(0.4, 0, 0.2, 1), transform 600ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate('/')}
          className="bg-white bg-opacity-20 backdrop-blur-lg border-0 text-white px-6 py-3 rounded-xl cursor-pointer text-sm font-medium hover:bg-opacity-30 hover:-translate-y-0.5 transition-all duration-300"
        >
          ← Back to Hub
        </button>
        
        <h1 className="text-white text-4xl font-bold drop-shadow-lg" style={{ fontFamily: 'Montserrat, system-ui, sans-serif' }}>
          {campaignData?.campaign_name || 'Email Campaign Dashboard'}
        </h1>
        
        <div className={`px-4 py-2 rounded-2xl text-sm font-semibold backdrop-blur-lg ${status.class} bg-opacity-90`}>
          {status.text}
        </div>
      </div>

      {/* Content */}
      <CampaignOverview />
    </div>
  )
}

export default EmailDashboard