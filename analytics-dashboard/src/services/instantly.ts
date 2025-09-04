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
  }
}