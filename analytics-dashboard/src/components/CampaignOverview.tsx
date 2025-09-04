import { useState, useEffect, useCallback, useMemo } from 'react';
import { instantlyApi } from '../services/instantly';
import type { CampaignAnalytics } from '../services/instantly';

interface CampaignOverviewProps {
  allowAnimations?: boolean;
}

const CampaignOverview = ({ allowAnimations = false }: CampaignOverviewProps) => {
  const [campaignData, setCampaignData] = useState<CampaignAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Remove dataLoaded - using individual animation states now
  const [animationState, setAnimationState] = useState({
    overview: false,
    card1: false,
    card2: false,
    card3: false,
    card4: false,
    performance: false
  });

  // Device performance detection and animation optimization
  const animationConfig = useMemo(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Device performance heuristics
    const isLowEndDevice = navigator.hardwareConcurrency <= 2 || 
                          ((navigator as any).deviceMemory && (navigator as any).deviceMemory <= 4);
    
    const baseDelay = prefersReducedMotion ? 0 : (isLowEndDevice ? 120 : 200);
    const duration = prefersReducedMotion ? 0 : (isLowEndDevice ? 400 : 800);
    
    return {
      duration,
      delays: {
        overview: 0,
        card1: baseDelay,
        card2: baseDelay * 2,
        card3: baseDelay * 3,
        card4: baseDelay * 4,
        performance: baseDelay * 5
      },
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      prefersReducedMotion
    };
  }, []);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Starting API call...');
        
        const campaigns = await instantlyApi.getCampaignAnalytics();
        console.log('Campaign Analytics Response:', campaigns);
        
        if (campaigns && campaigns.length > 0) {
          console.log('Setting campaign data:', campaigns[0]);
          setCampaignData(campaigns[0]);
          // Data loaded - animations will be triggered separately when allowed
        } else {
          console.log('No campaigns found in response');
          setError('No campaigns found');
        }
      } catch (err) {
        console.error('API Error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(`Failed to load campaign data: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignData();
  }, [animationConfig]);

  // Separate effect to handle animation triggering when allowed
  useEffect(() => {
    if (allowAnimations && campaignData && !animationState.overview) {
      // Data is loaded and we're allowed to animate
      const triggerAnimation = (element: keyof typeof animationState, delay: number) => {
        setTimeout(() => {
          requestAnimationFrame(() => {
            setAnimationState(prev => ({ ...prev, [element]: true }));
          });
        }, delay);
      };

      triggerAnimation('overview', 0);
      triggerAnimation('card1', animationConfig.delays.card1);
      triggerAnimation('card2', animationConfig.delays.card2);
      triggerAnimation('card3', animationConfig.delays.card3);
      triggerAnimation('card4', animationConfig.delays.card4);
      triggerAnimation('performance', animationConfig.delays.performance);
    }
  }, [allowAnimations, campaignData, animationState.overview, animationConfig.delays]);

  // Helper function for consistent animation styles
  const getAnimationStyle = useCallback((isActive: boolean) => {
    if (animationConfig.prefersReducedMotion) {
      return {
        opacity: 1,
        transform: 'translateY(0) translateZ(0)',
        transition: 'none'
      };
    }

    return {
      opacity: isActive ? 1 : 0,
      transform: isActive ? 'translateY(0) translateZ(0)' : 'translateY(24px) translateZ(0)',
      transition: `opacity ${animationConfig.duration}ms ${animationConfig.easing}, transform ${animationConfig.duration}ms ${animationConfig.easing}`,
      willChange: isActive ? 'auto' : 'transform, opacity'
    };
  }, [animationConfig]);

  if (loading || !campaignData) {
    return (
      <div className="max-w-7xl mx-auto">
        {/* Campaign Overview - Loading */}
        <div className="bg-white bg-opacity-95 backdrop-blur-5 border border-white border-opacity-20 rounded-xl overflow-hidden mb-6">
          <div className="p-5 border-b border-black border-opacity-6">
            <h2 className="text-base font-semibold text-slate-900 tracking-tight">Campaign Overview</h2>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Key Metrics - Loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white bg-opacity-95 backdrop-blur-5 border border-white border-opacity-20 rounded-xl p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-12 mb-2 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          ))}
        </div>
        
        {/* Performance Breakdown - Loading */}
        <div className="bg-white bg-opacity-95 backdrop-blur-5 border border-white border-opacity-20 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-black border-opacity-6">
            <h2 className="text-base font-semibold text-slate-900 tracking-tight">Performance Breakdown</h2>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col gap-2 p-4 bg-white bg-opacity-95 border border-white border-opacity-20 rounded-lg">
                  <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-8 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white bg-opacity-95 backdrop-blur-5 border border-white border-opacity-20 rounded-xl p-6 border-l-4 border-red-500">
          <div className="text-red-600 font-medium">Error</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  if (!campaignData) return null;

  // Calculate metrics (for future use)
  // const openRate = campaignData.emails_sent_count > 0 ? (campaignData.open_count / campaignData.emails_sent_count) * 100 : 0;
  // const replyRate = campaignData.emails_sent_count > 0 ? (campaignData.reply_count / campaignData.emails_sent_count) * 100 : 0;
  // const bounceRate = campaignData.emails_sent_count > 0 ? (campaignData.bounced_count / campaignData.emails_sent_count) * 100 : 0;
  // const clickRate = campaignData.emails_sent_count > 0 ? (campaignData.link_click_count / campaignData.emails_sent_count) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto animation-container transition-optimized">
      
      {/* Campaign Overview */}
      <div 
        className="bg-white bg-opacity-95 backdrop-blur-5 border border-white border-opacity-20 rounded-xl overflow-hidden mb-6 gpu-accelerated"
        style={getAnimationStyle(animationState.overview)}
      >
        <div className="p-5 border-b border-black border-opacity-6">
          <h2 className="text-base font-semibold text-slate-900 tracking-tight">Campaign Overview</h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Email Account</div>
              <div className="text-sm font-semibold text-slate-900">alex@thunderbird-labs.com</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Daily Limit</div>
              <div className="text-sm font-semibold text-slate-900">5 emails/day</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Sequence</div>
              <div className="text-sm font-semibold text-slate-900">1 step sequence</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Created</div>
              <div className="text-sm font-semibold text-slate-900">Aug 29, 2025</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div 
          className="bg-white bg-opacity-95 backdrop-blur-5 border border-white border-opacity-20 rounded-xl p-5 transition-all duration-200 hover:border-white hover:border-opacity-40 hover:-translate-y-0.5 hover:shadow-2xl gpu-accelerated metric-card"
          style={{
            ...getAnimationStyle(animationState.card1),
            transitionProperty: animationConfig.prefersReducedMotion ? 'none' : 'opacity, transform, border-color, box-shadow'
          }}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Leads</div>
            <div className="w-6 h-6 flex items-center justify-center text-xs opacity-60">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 leading-none mb-2">
            {campaignData.leads_count?.toLocaleString() || 0}
          </div>
          <div className="text-xs text-slate-500 font-medium">In campaign database</div>
        </div>
        
        <div 
          className="bg-white bg-opacity-95 backdrop-blur-5 border border-white border-opacity-20 rounded-xl p-5 transition-all duration-200 hover:border-white hover:border-opacity-40 hover:-translate-y-0.5 hover:shadow-2xl gpu-accelerated metric-card"
          style={{
            ...getAnimationStyle(animationState.card2),
            transitionProperty: animationConfig.prefersReducedMotion ? 'none' : 'opacity, transform, border-color, box-shadow'
          }}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Emails Sent</div>
            <div className="w-6 h-6 flex items-center justify-center text-xs opacity-60">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m22 2-7 20-4-9-9-4Z"/>
                <path d="M22 2 11 13"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 leading-none mb-2">
            {campaignData.emails_sent_count?.toLocaleString() || 0}
          </div>
          <div className="text-xs text-slate-500 font-medium">Total outreach</div>
        </div>
        
        <div 
          className="bg-white bg-opacity-95 backdrop-blur-5 border border-white border-opacity-20 rounded-xl p-5 transition-all duration-200 hover:border-white hover:border-opacity-40 hover:-translate-y-0.5 hover:shadow-2xl gpu-accelerated metric-card"
          style={{
            ...getAnimationStyle(animationState.card3),
            transitionProperty: animationConfig.prefersReducedMotion ? 'none' : 'opacity, transform, border-color, box-shadow'
          }}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Opens</div>
            <div className="w-6 h-6 flex items-center justify-center text-xs opacity-60">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 leading-none mb-2">
            {campaignData.open_count?.toLocaleString() || 0}
          </div>
          <div className="text-xs text-slate-500 font-medium">Email opens</div>
          <div className="text-xs font-semibold mt-2 text-green-600">
            {campaignData.emails_sent_count > 0 ? ((campaignData.open_count / campaignData.emails_sent_count) * 100).toFixed(1) : 0}%
          </div>
        </div>
        
        <div 
          className="bg-white bg-opacity-95 backdrop-blur-5 border border-white border-opacity-20 rounded-xl p-5 transition-all duration-200 hover:border-white hover:border-opacity-40 hover:-translate-y-0.5 hover:shadow-2xl gpu-accelerated metric-card"
          style={{
            ...getAnimationStyle(animationState.card4),
            transitionProperty: animationConfig.prefersReducedMotion ? 'none' : 'opacity, transform, border-color, box-shadow'
          }}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Replies</div>
            <div className="w-6 h-6 flex items-center justify-center text-xs opacity-60">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 leading-none mb-2">
            {campaignData.reply_count?.toLocaleString() || 0}
          </div>
          <div className="text-xs text-slate-500 font-medium">Responses received</div>
          <div className="text-xs font-semibold mt-2 text-red-600">
            {campaignData.emails_sent_count > 0 ? ((campaignData.reply_count / campaignData.emails_sent_count) * 100).toFixed(1) : 0}%
          </div>
        </div>
      </div>
      
      {/* Performance Details */}
      <div 
        className="bg-white bg-opacity-95 backdrop-blur-5 border border-white border-opacity-20 rounded-xl overflow-hidden gpu-accelerated"
        style={getAnimationStyle(animationState.performance)}
      >
        <div className="p-5 border-b border-black border-opacity-6">
          <h2 className="text-base font-semibold text-slate-900 tracking-tight">Performance Breakdown</h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="flex flex-col gap-2 p-4 bg-white bg-opacity-95 border border-white border-opacity-20 rounded-lg transition-all duration-200 hover:bg-white hover:bg-opacity-100 hover:border-white hover:border-opacity-40">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider opacity-70">Contacted</div>
              <div className="text-xl font-bold text-slate-900">
                {campaignData.contacted_count?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-slate-500 font-medium opacity-70">Leads reached</div>
            </div>
            
            <div className="flex flex-col gap-2 p-4 bg-white bg-opacity-95 border border-white border-opacity-20 rounded-lg transition-all duration-200 hover:bg-white hover:bg-opacity-100 hover:border-white hover:border-opacity-40">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider opacity-70">New Contacted</div>
              <div className="text-xl font-bold text-slate-900">
                {campaignData.new_leads_contacted_count?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-slate-500 font-medium opacity-70">Fresh outreach</div>
            </div>
            
            <div className="flex flex-col gap-2 p-4 bg-white bg-opacity-95 border border-white border-opacity-20 rounded-lg transition-all duration-200 hover:bg-white hover:bg-opacity-100 hover:border-white hover:border-opacity-40">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider opacity-70">Link Clicks</div>
              <div className="text-xl font-bold text-slate-900">
                {campaignData.link_click_count?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-slate-500 font-medium opacity-70">
                {campaignData.emails_sent_count > 0 ? ((campaignData.link_click_count / campaignData.emails_sent_count) * 100).toFixed(1) : 0}% rate
              </div>
            </div>
            
            <div className="flex flex-col gap-2 p-4 bg-white bg-opacity-95 border border-white border-opacity-20 rounded-lg transition-all duration-200 hover:bg-white hover:bg-opacity-100 hover:border-white hover:border-opacity-40">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider opacity-70">Completed</div>
              <div className="text-xl font-bold text-slate-900">
                {campaignData.completed_count?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-slate-500 font-medium opacity-70">Sequence done</div>
            </div>
            
            <div className="flex flex-col gap-2 p-4 bg-white bg-opacity-95 border border-white border-opacity-20 rounded-lg transition-all duration-200 hover:bg-white hover:bg-opacity-100 hover:border-white hover:border-opacity-40">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider opacity-70">Bounced</div>
              <div className="text-xl font-bold text-slate-900">
                {campaignData.bounced_count?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-slate-500 font-medium opacity-70">
                {campaignData.emails_sent_count > 0 ? ((campaignData.bounced_count / campaignData.emails_sent_count) * 100).toFixed(1) : 0}% rate
              </div>
            </div>
            
            <div className="flex flex-col gap-2 p-4 bg-white bg-opacity-95 border border-white border-opacity-20 rounded-lg transition-all duration-200 hover:bg-white hover:bg-opacity-100 hover:border-white hover:border-opacity-40">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider opacity-70">Opportunities</div>
              <div className="text-xl font-bold text-slate-900">
                {campaignData.total_opportunities?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-slate-500 font-medium opacity-70">
                ${campaignData.total_opportunity_value?.toLocaleString() || 0} value
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignOverview;