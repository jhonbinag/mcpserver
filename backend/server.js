    const express = require('express');
    const cors = require('cors');
    const dotenv = require('dotenv');

    // Load environment variables
    dotenv.config();

    // Initialize express app
    const app = express();

    // Security headers middleware
    app.use((req, res, next) => {
        // Security headers
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        res.setHeader('Content-Security-Policy', "default-src 'self'");
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        // Handle preflight requests
        if (req.method === 'OPTIONS') {
            return res.sendStatus(200);
        }
        
        next();
    });

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Basic health check endpoint
    app.get('/health', (req, res) => {
        res.json({ status: 'healthy', timestamp: new Date().toISOString() });
    });

    // MCP API endpoints
    app.post('/api/process', async (req, res) => {
        try {
            const { action, data } = req.body;
            
            // Handle different MCP actions
            switch (action) {
                case 'fetch':
                    // Handle fetch requests
                    res.json({ success: true, message: 'Fetch request received', data });
                    break;
                
                case 'workflow':
                    // Handle workflow requests
                    res.json({ success: true, message: 'Workflow request received', data });
                    break;
                
                default:
                    res.status(400).json({ 
                        success: false, 
                        message: 'Invalid action specified' 
                    });
            }
        } catch (error) {
            console.error('Process error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Internal server error',
                error: error.message 
            });
        }
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ 
            success: false, 
            message: 'Something went wrong!',
            error: err.message 
        });
    });

    // Export the Express app for Vercel
    module.exports = app;
