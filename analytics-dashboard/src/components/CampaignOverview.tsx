import { useState, useEffect } from 'react';
import { instantlyApi } from '../services/instantly';
import type { CampaignAnalytics } from '../services/instantly';

const CampaignOverview = () => {
  const [campaignData, setCampaignData] = useState<CampaignAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

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
          // Add a small delay to ensure smooth animation
          setTimeout(() => {
            setDataLoaded(true);
          }, 100);
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
  }, []);

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
                <div key={i} className="flex flex-col gap-2 p-4 bg-black bg-opacity-80 border border-black border-opacity-4 rounded-lg">
                  <div className="h-3 bg-gray-400 rounded w-16 animate-pulse opacity-50"></div>
                  <div className="h-6 bg-gray-300 rounded w-8 animate-pulse opacity-50"></div>
                  <div className="h-3 bg-gray-400 rounded w-12 animate-pulse opacity-50"></div>
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
    <div className="max-w-7xl mx-auto" style={{
      opacity: dataLoaded ? 1 : 0,
      transform: dataLoaded ? 'scale(1) translateZ(0)' : 'scale(0.95) translateZ(-10px)',
      transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
    }}>
      
      {/* Campaign Overview */}
      <div className="bg-white bg-opacity-95 backdrop-blur-5 border border-white border-opacity-20 rounded-xl overflow-hidden mb-6">
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
        <div className="bg-white bg-opacity-95 backdrop-blur-5 border border-white border-opacity-20 rounded-xl p-5 transition-all duration-200 hover:border-white hover:border-opacity-40 hover:-translate-y-0.5 hover:shadow-2xl">
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
          <div className="text-3xl font-extrabold text-slate-900 leading-none mb-2"
               style={{
                 opacity: dataLoaded ? 1 : 0,
                 transform: dataLoaded ? 'scale(1)' : 'scale(0.9)',
                 transition: 'opacity 0.5s ease-out 0.2s, transform 0.5s ease-out 0.2s'
               }}>
            {dataLoaded ? (campaignData.leads_count?.toLocaleString() || 0) : ''}
          </div>
          <div className="text-xs text-slate-500 font-medium">In campaign database</div>
        </div>
        
        <div className="bg-white bg-opacity-95 backdrop-blur-5 border border-white border-opacity-20 rounded-xl p-5 transition-all duration-200 hover:border-white hover:border-opacity-40 hover:-translate-y-0.5 hover:shadow-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Emails Sent</div>
            <div className="w-6 h-6 flex items-center justify-center text-xs opacity-60">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m22 2-7 20-4-9-9-4Z"/>
                <path d="M22 2 11 13"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 leading-none mb-2"
               style={{
                 opacity: dataLoaded ? 1 : 0,
                 transform: dataLoaded ? 'scale(1)' : 'scale(0.9)',
                 transition: 'opacity 0.5s ease-out 0.3s, transform 0.5s ease-out 0.3s'
               }}>
            {dataLoaded ? (campaignData.emails_sent_count?.toLocaleString() || 0) : ''}
          </div>
          <div className="text-xs text-slate-500 font-medium">Total outreach</div>
        </div>
        
        <div className="bg-white bg-opacity-95 backdrop-blur-5 border border-white border-opacity-20 rounded-xl p-5 transition-all duration-200 hover:border-white hover:border-opacity-40 hover:-translate-y-0.5 hover:shadow-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Opens</div>
            <div className="w-6 h-6 flex items-center justify-center text-xs opacity-60">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 leading-none mb-2"
               style={{
                 opacity: dataLoaded ? 1 : 0,
                 transform: dataLoaded ? 'scale(1)' : 'scale(0.9)',
                 transition: 'opacity 0.5s ease-out 0.4s, transform 0.5s ease-out 0.4s'
               }}>
            {dataLoaded ? (campaignData.open_count?.toLocaleString() || 0) : ''}
          </div>
          <div className="text-xs text-slate-500 font-medium">Email opens</div>
          <div className="text-xs font-semibold mt-2 text-green-600">
            {campaignData.emails_sent_count > 0 ? ((campaignData.open_count / campaignData.emails_sent_count) * 100).toFixed(1) : 0}%
          </div>
        </div>
        
        <div className="bg-white bg-opacity-95 backdrop-blur-5 border border-white border-opacity-20 rounded-xl p-5 transition-all duration-200 hover:border-white hover:border-opacity-40 hover:-translate-y-0.5 hover:shadow-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Replies</div>
            <div className="w-6 h-6 flex items-center justify-center text-xs opacity-60">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 leading-none mb-2"
               style={{
                 opacity: dataLoaded ? 1 : 0,
                 transform: dataLoaded ? 'scale(1)' : 'scale(0.9)',
                 transition: 'opacity 0.5s ease-out 0.5s, transform 0.5s ease-out 0.5s'
               }}>
            {dataLoaded ? (campaignData.reply_count?.toLocaleString() || 0) : ''}
          </div>
          <div className="text-xs text-slate-500 font-medium">Responses received</div>
          <div className="text-xs font-semibold mt-2 text-red-600">
            {campaignData.emails_sent_count > 0 ? ((campaignData.reply_count / campaignData.emails_sent_count) * 100).toFixed(1) : 0}%
          </div>
        </div>
      </div>
      
      {/* Performance Details */}
      <div className="bg-white bg-opacity-95 backdrop-blur-5 border border-white border-opacity-20 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-black border-opacity-6">
          <h2 className="text-base font-semibold text-slate-900 tracking-tight">Performance Breakdown</h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="flex flex-col gap-2 p-4 bg-black bg-opacity-80 border border-black border-opacity-4 rounded-lg transition-all duration-200 hover:bg-black hover:bg-opacity-90 hover:border-black hover:border-opacity-8">
              <div className="text-xs font-medium text-white uppercase tracking-wider opacity-70">Contacted</div>
              <div className="text-xl font-bold text-white">
                {campaignData.contacted_count?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-white font-medium opacity-70">Leads reached</div>
            </div>
            
            <div className="flex flex-col gap-2 p-4 bg-black bg-opacity-80 border border-black border-opacity-4 rounded-lg transition-all duration-200 hover:bg-black hover:bg-opacity-90 hover:border-black hover:border-opacity-8">
              <div className="text-xs font-medium text-white uppercase tracking-wider opacity-70">New Contacted</div>
              <div className="text-xl font-bold text-white">
                {campaignData.new_leads_contacted_count?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-white font-medium opacity-70">Fresh outreach</div>
            </div>
            
            <div className="flex flex-col gap-2 p-4 bg-black bg-opacity-80 border border-black border-opacity-4 rounded-lg transition-all duration-200 hover:bg-black hover:bg-opacity-90 hover:border-black hover:border-opacity-8">
              <div className="text-xs font-medium text-white uppercase tracking-wider opacity-70">Link Clicks</div>
              <div className="text-xl font-bold text-white">
                {campaignData.link_click_count?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-white font-medium opacity-70">
                {campaignData.emails_sent_count > 0 ? ((campaignData.link_click_count / campaignData.emails_sent_count) * 100).toFixed(1) : 0}% rate
              </div>
            </div>
            
            <div className="flex flex-col gap-2 p-4 bg-black bg-opacity-80 border border-black border-opacity-4 rounded-lg transition-all duration-200 hover:bg-black hover:bg-opacity-90 hover:border-black hover:border-opacity-8">
              <div className="text-xs font-medium text-white uppercase tracking-wider opacity-70">Completed</div>
              <div className="text-xl font-bold text-white">
                {campaignData.completed_count?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-white font-medium opacity-70">Sequence done</div>
            </div>
            
            <div className="flex flex-col gap-2 p-4 bg-black bg-opacity-80 border border-black border-opacity-4 rounded-lg transition-all duration-200 hover:bg-black hover:bg-opacity-90 hover:border-black hover:border-opacity-8">
              <div className="text-xs font-medium text-white uppercase tracking-wider opacity-70">Bounced</div>
              <div className="text-xl font-bold text-white">
                {campaignData.bounced_count?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-white font-medium opacity-70">
                {campaignData.emails_sent_count > 0 ? ((campaignData.bounced_count / campaignData.emails_sent_count) * 100).toFixed(1) : 0}% rate
              </div>
            </div>
            
            <div className="flex flex-col gap-2 p-4 bg-black bg-opacity-80 border border-black border-opacity-4 rounded-lg transition-all duration-200 hover:bg-black hover:bg-opacity-90 hover:border-black hover:border-opacity-8">
              <div className="text-xs font-medium text-white uppercase tracking-wider opacity-70">Opportunities</div>
              <div className="text-xl font-bold text-white">
                {campaignData.total_opportunities?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-white font-medium opacity-70">
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