import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { id } = req.query
    
    if (!id || typeof id !== 'string') {
      res.status(400).json({ error: 'Campaign ID is required' })
      return
    }

    // API credentials from environment variables
    const INSTANTLY_API_KEY = process.env.INSTANTLY_API_KEY || 'MmQ4NzQ5ZWUtMGFmNC00MDQ3LWI5NDktZTZjYjU2NzkzMjYyOlpsWWtyaFJnUm5zTA=='
    
    // Debug logging
    console.log('Vercel Debug [Details] - Campaign ID:', id)
    console.log('Vercel Debug [Details] - API Key (first 10 chars):', INSTANTLY_API_KEY.substring(0, 10) + '...')
    console.log('Vercel Debug [Details] - Using env API key:', !!process.env.INSTANTLY_API_KEY)
    
    const response = await fetch(
      `https://api.instantly.ai/api/v2/campaigns/${id}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${INSTANTLY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Instantly API responded with status: ${response.status}`)
    }

    const data = await response.json()
    
    // Debug logging for response
    console.log('Vercel Debug [Details] - API Response:', JSON.stringify(data, null, 2))
    
    res.status(200).json(data)
  } catch (error) {
    console.error('Error fetching campaign details:', error)
    res.status(500).json({ 
      error: 'Failed to fetch campaign details',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
