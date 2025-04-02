    const express = require('express');
    const cors = require('cors');
    const dotenv = require('dotenv');

    // Load environment variables
    dotenv.config();

    // Initialize express app
    const app = express();

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
