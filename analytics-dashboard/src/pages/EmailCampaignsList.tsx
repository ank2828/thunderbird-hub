import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTransition } from '../contexts/TransitionContext'
import { instantlyApi } from '../services/instantly'
import type { CampaignData } from '../services/instantly'

const EmailCampaignsList = () => {
  const navigate = useNavigate()
  const { completeTransition } = useTransition()
  const [campaigns, setCampaigns] = useState<CampaignData[]>([])
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [showCards, setShowCards] = useState(false)

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        // Reset animation state when fetching
        setShowCards(false)
        
        // First get all campaign analytics to get the list of campaigns
        const analyticsData = await instantlyApi.getCampaignAnalytics()
        
        // Then fetch complete data (analytics + details) for each campaign
        const campaignsWithDetails = await Promise.all(
          analyticsData.map(async (campaign) => {
            try {
              return await instantlyApi.getCampaignData(campaign.campaign_id)
            } catch (error) {
              console.error(`Error fetching details for campaign ${campaign.campaign_id}:`, error)
              // Fallback to analytics-only data
              return {
                analytics: campaign,
                details: {}
              } as CampaignData
            }
          })
        )
        
        setCampaigns(campaignsWithDetails)
        setLoading(false)
        
        // Start card animations after data is loaded
        setTimeout(() => {
          setShowCards(true)
        }, 100)
      } catch (error) {
        console.error('Error fetching campaigns:', error)
        setLoading(false)
      }
    }

    // Coordinated timing for smooth transition
    setTimeout(() => {
      setIsVisible(true)
    }, 300)

    setTimeout(() => {
      completeTransition()
    }, 600)

    // Initial fetch
    fetchCampaigns()

    // Set up polling for real-time updates
    const POLL_INTERVAL = 30000 // 30 seconds
    let intervalId: NodeJS.Timeout
    let isTabVisible = true

    // Handle tab visibility changes
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden
      if (isTabVisible) {
        // Refresh immediately when tab becomes visible
        fetchCampaigns()
      }
    }

    // Start polling
    intervalId = setInterval(() => {
      if (isTabVisible && !loading) {
        fetchCampaigns()
      }
    }, POLL_INTERVAL)

    // Listen for tab visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup
    return () => {
      if (intervalId) clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [completeTransition, loading])

  const handleCampaignClick = (campaign: CampaignData) => {
    // Navigate to specific campaign dashboard
    navigate(`/email-dashboard/${campaign.analytics.campaign_id}`)
  }

  // Smart status detection - same logic as EmailDashboard
  const getCurrentStatus = (campaignData: CampaignData) => {
    // Try details endpoint first (more current)
    const detailsStatus = campaignData?.details?.campaign_status ?? campaignData?.details?.status
    if (detailsStatus !== undefined) {
      return detailsStatus
    }
    
    // Fallback to analytics endpoint
    return campaignData?.analytics?.campaign_status
  }

  const getStatusText = (status: number) => {
    switch (status) {
      case 1:
        return { text: 'Running', class: 'bg-green-100 text-green-800' }
      case 2:
        return { text: 'Paused', class: 'bg-yellow-100 text-yellow-800' }
      case 0:
        return { text: 'Draft', class: 'bg-gray-100 text-gray-800' }
      case 3:
        return { text: 'Completed', class: 'bg-blue-100 text-blue-800' }
      default:
        return { text: 'Unknown', class: 'bg-gray-100 text-gray-800' }
    }
  }

  return (
    <div 
      className="min-h-screen p-8 gpu-accelerated transition-opacity duration-700"
      style={{
        background: '#000000',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
      }}
    >
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <button
          onClick={() => navigate('/')}
          className="bg-white bg-opacity-20 backdrop-blur-lg border-0 text-white px-6 py-3 rounded-xl cursor-pointer text-sm font-medium hover:bg-opacity-30 hover:-translate-y-0.5 transition-all duration-300 mb-6"
        >
          ← Back to Home
        </button>
        
        <h1 className="text-white text-5xl font-bold mb-4" style={{ fontFamily: 'Montserrat, system-ui, sans-serif' }}>
          Email Campaigns
        </h1>
        <p className="text-gray-400 text-lg">
          Select a campaign to view detailed analytics and manage settings
        </p>
      </div>

      {/* Campaigns Grid */}
      <div className="max-w-6xl mx-auto">
        {/* Loading State */}
        {loading && (
          <div 
            className="flex justify-center items-center py-20 transition-opacity duration-500"
            style={{
              opacity: loading ? 1 : 0
            }}
          >
            <div className="text-white text-lg">Loading campaigns...</div>
          </div>
        )}
        
        {/* No Campaigns State */}
        {!loading && campaigns.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-400 text-lg">No campaigns found</div>
          </div>
        )}
        
        {/* Campaigns Grid */}
        {!loading && campaigns.length > 0 && (
          <div className="grid gap-6">
            {campaigns.map((campaign, index) => {
              const currentStatusValue = getCurrentStatus(campaign)
              const status = getStatusText(currentStatusValue || 0)
              
              return (
                <div
                  key={campaign.analytics.campaign_id}
                  onClick={() => handleCampaignClick(campaign)}
                  className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-8 cursor-pointer transform transition-all duration-700 hover:scale-105 hover:shadow-2xl border border-white border-opacity-30"
                  style={{
                    opacity: showCards ? 1 : 0,
                    transform: showCards ? 'translateY(0) translateZ(0)' : 'translateY(24px) translateZ(0)',
                    transition: 'opacity 400ms cubic-bezier(0.4, 0, 0.2, 1), transform 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                    transitionDelay: `${index * 120}ms`
                  }}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Montserrat, system-ui, sans-serif' }}>
                        {campaign.analytics.campaign_name}
                      </h2>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.class}`}>
                          {status.text}
                        </span>
                        <span className="text-slate-500 text-sm">
                          {campaign.analytics.campaign_is_evergreen ? 'Evergreen Campaign' : 'Standard Campaign'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-slate-500 mb-1">Campaign ID</div>
                      <div className="text-xs text-slate-400 font-mono">
                        {campaign.analytics.campaign_id.slice(0, 8)}...
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">
                        {campaign.analytics.leads_count?.toLocaleString() || 0}
                      </div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider">Total Leads</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">
                        {campaign.analytics.emails_sent_count?.toLocaleString() || 0}
                      </div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider">Emails Sent</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">
                        {campaign.analytics.open_count?.toLocaleString() || 0}
                      </div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider">Opens</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">
                        {campaign.analytics.reply_count?.toLocaleString() || 0}
                      </div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider">Replies</div>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="mt-6 flex items-center gap-2">
                    <span className="text-slate-500 text-sm">Click to view detailed analytics</span>
                    <span className="text-slate-400">→</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default EmailCampaignsList
