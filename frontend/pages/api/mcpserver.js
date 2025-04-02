import axios from 'axios';

// This is a simple API route that proxies requests to the backend MCP server
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    // Get the action and data from the request body
    const { action, serverName, data, conversationId, message, context } = req.body;
    
    // Determine which API endpoint to use
    let endpoint = '';
    let payload = {};
    
    if (message) {
      // This is a conversation request
      endpoint = '/api/conversation';
      payload = { conversationId, message, context };
    } else if (action === 'list') {
      // This is a list request
      endpoint = '/api/process';
      payload = { action: 'list' };
    } else if (serverName) {
      // This is a server-specific request
      endpoint = `/api/${serverName.replace('server-', '').replace('-mcp', '')}`;
      payload = data || {};
    } else {
      // This is a generic process request
      endpoint = '/api/process';
      payload = { action, serverName, data };
    }
    
    // Make the request to the backend
    const response = await axios.post(
      `${process.env.API_URL}${endpoint}`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    // Return the response from the backend
    return res.status(response.status).json(response.data);
  } catch (error) {
    // Log the error for debugging
    console.error('API error:', error);
    
    // Return an error response
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Internal server error',
      error: error.message,
    });
  }
} 