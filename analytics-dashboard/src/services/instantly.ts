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
      console.log('Making API call to get campaign details for ID:', campaignId);
      
      const response = await axios.get(`${INSTANTLY_API_BASE_URL}/campaigns/${campaignId}`);
      
      console.log('Campaign Details Response:', response.data);
      return response.data || {}
    } catch (error) {
      console.error('Error fetching campaign details:', error);
      if (error instanceof Error) {
        console.error('Error response:', (error as any).response?.data);
        console.error('Error status:', (error as any).response?.status);
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
      const details = await this.getCampaignDetails(campaignId);
      console.log('Details response:', details);
      console.log('Details campaign_status:', details.campaign_status || details.status);
      
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