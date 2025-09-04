import axios from 'axios'

// API key is now handled by serverless function
// const INSTANTLY_API_KEY = 'MmQ4NzQ5ZWUtMGFmNC00MDQ3LWI5NDktZTZjYjU2NzkzMjYyOlpsWWtyaFJnUm5zTA=='
// Use the Vite proxy instead of direct API call to avoid CORS
const INSTANTLY_API_BASE_URL = '/api/instantly'

export interface CampaignAnalytics {
  campaign_name: string
  campaign_id: string
  campaign_status: number
  campaign_is_evergreen: boolean
  leads_count: number
  contacted_count: number
  open_count: number
  reply_count: number
  link_click_count: number
  bounced_count: number
  unsubscribed_count: number
  completed_count: number
  emails_sent_count: number
  new_leads_contacted_count: number
  total_opportunities: number
  total_opportunity_value: number
}

// New interface for campaign details endpoint
export interface CampaignDetails {
  email_list: string | string[] // Can be single email or array of emails
  daily_limit: number // Daily email sending limit
  campaign_status?: number // Status might also be in details endpoint
  status?: number // Alternative status field name
  [key: string]: any
}

// Combined data interface
export interface CampaignData {
  analytics: CampaignAnalytics
  details: CampaignDetails
}

export const instantlyApi = {
  async getCampaignAnalytics(): Promise<CampaignAnalytics[]> {
    try {
      console.log('Making API call to get campaign analytics...');
      
      const response = await axios.get(`${INSTANTLY_API_BASE_URL}/campaigns/analytics`, {
        params: {
          id: 'ce377a89-a781-474f-9425-f50bdac55b79'
        }
      })
      
      console.log('Raw API Response:', response.data);
      
      // The response should be an array, if it's a single object, wrap it
      const campaigns = Array.isArray(response.data) ? response.data : [response.data];
      
      console.log('Processed campaigns:', campaigns);
      return campaigns || []
    } catch (error) {
      console.error('Error fetching campaign analytics:', error);
      if (error instanceof Error) {
        console.error('Error response:', (error as any).response?.data);
        console.error('Error status:', (error as any).response?.status);
      }
      throw error instanceof Error ? error : new Error('Failed to fetch campaign analytics')
    }
  },

  async getCampaignDetails(campaignId: string): Promise<CampaignDetails> {
    try {
      console.log('🚀 Making API call to get campaign details for ID:', campaignId);
      console.log('🚀 API URL will be:', `${INSTANTLY_API_BASE_URL}/campaigns/${campaignId}`);
      
      const response = await axios.get(`${INSTANTLY_API_BASE_URL}/campaigns/${campaignId}`);
      
      console.log('✅ Campaign Details Response received:', response.data);
      console.log('✅ Response status:', response.status);
      return response.data || {}
    } catch (error) {
      console.error('❌ CAMPAIGN DETAILS ERROR:', error);
      if (error instanceof Error) {
        console.error('❌ Error message:', error.message);
        console.error('❌ Error response data:', (error as any).response?.data);
        console.error('❌ Error response status:', (error as any).response?.status);
        console.error('❌ Error response headers:', (error as any).response?.headers);
      }
      throw error instanceof Error ? error : new Error('Failed to fetch campaign details')
    }
  },

  // Combined function that gets both analytics and details for a specific campaign
  async getCampaignData(specificCampaignId?: string): Promise<CampaignData> {
    try {
      console.log('Fetching complete campaign data...', specificCampaignId ? `for campaign: ${specificCampaignId}` : 'using first available');
      
      // Step 1: Get analytics (which contains campaign_id)
      const analytics = await this.getCampaignAnalytics();
      if (!analytics || analytics.length === 0) {
        throw new Error('No campaign analytics found');
      }
      
      // Find the specific campaign or use the first one
      let campaignAnalytics: CampaignAnalytics;
      if (specificCampaignId) {
        const foundCampaign = analytics.find(campaign => campaign.campaign_id === specificCampaignId);
        if (!foundCampaign) {
          throw new Error(`Campaign with ID ${specificCampaignId} not found`);
        }
        campaignAnalytics = foundCampaign;
      } else {
        campaignAnalytics = analytics[0];
      }
      
      const campaignId = campaignAnalytics.campaign_id;
      
      console.log('Using campaign ID from analytics:', campaignId);
      console.log('Analytics campaign_status:', campaignAnalytics.campaign_status);
      
      // Step 2: Get campaign details using the ID from analytics
      console.log('🚀 ABOUT TO CALL getCampaignDetails with ID:', campaignId);
      
      let details;
      try {
        details = await this.getCampaignDetails(campaignId);
        console.log('✅ SUCCESS - Details API call completed');
        console.log('🔍 DETAILS DEBUG - Full response:', details);
        console.log('🔍 DETAILS DEBUG - email_list:', details.email_list);
        console.log('🔍 DETAILS DEBUG - daily_limit:', details.daily_limit);
        console.log('🔍 DETAILS DEBUG - campaign_status:', details.campaign_status || details.status);
        console.log('🔍 DETAILS DEBUG - Available keys:', Object.keys(details || {}));
      } catch (detailsError) {
        console.error('❌ DETAILS API ERROR:', detailsError);
        console.error('❌ Error details:', detailsError.message);
        console.error('❌ Error stack:', detailsError.stack);
        // Fallback to empty details object
        details = {};
      }
      
      return {
        analytics: campaignAnalytics,
        details: details
      };
    } catch (error) {
      console.error('Error fetching complete campaign data:', error);
      throw error instanceof Error ? error : new Error('Failed to fetch complete campaign data')
    }
  }
}