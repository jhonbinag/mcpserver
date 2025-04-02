const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { spawn } = require('child_process');
const mcpConfig = require('../.cursor/mcp.json');

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
    res.setHeader('Content-Security-Policy', "default-src 'self' https://ammcpserver.vercel.app");
    res.setHeader('Access-Control-Allow-Origin', 'https://ammcpserver.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
});

// CORS configuration
const corsOptions = {
    origin: 'https://ammcpserver.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Function to execute MCP command
const executeMCPCommand = (serverName, data) => {
    return new Promise((resolve, reject) => {
        const serverConfig = mcpConfig.mcpServers[serverName];
        if (!serverConfig) {
            reject(new Error(`Server ${serverName} not found in configuration`));
            return;
        }

        const command = serverConfig.command;
        const args = [...serverConfig.args];

        // Add any additional data as arguments if needed
        if (data) {
            args.push('--data', JSON.stringify(data));
        }

        const process = spawn(command, args);

        let output = '';
        let error = '';

        process.stdout.on('data', (data) => {
            output += data.toString();
            console.log(`MCP ${serverName} stdout:`, data.toString());
        });

        process.stderr.on('data', (data) => {
            error += data.toString();
            console.error(`MCP ${serverName} stderr:`, data.toString());
        });

        process.on('close', (code) => {
            if (code === 0) {
                resolve({ success: true, output });
            } else {
                reject(new Error(`Process exited with code ${code}\nError: ${error}`));
            }
        });
    });
};

// Basic health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        domain: 'ammcpserver.vercel.app',
        availableMCPs: Object.keys(mcpConfig.mcpServers)
    });
});

// MCP API endpoints
app.post('/api/process', async (req, res) => {
    try {
        const { action, data, serverName } = req.body;
        
        // Handle different MCP actions
        switch (action) {
            case 'execute':
                if (!serverName) {
                    res.status(400).json({ 
                        success: false, 
                        message: 'Server name is required for execute action',
                        domain: 'ammcpserver.vercel.app'
                    });
                    return;
                }

                try {
                    const result = await executeMCPCommand(serverName, data);
                    res.json({ 
                        success: true, 
                        message: `Successfully executed ${serverName}`,
                        result,
                        domain: 'ammcpserver.vercel.app'
                    });
                } catch (error) {
                    res.status(500).json({ 
                        success: false, 
                        message: `Failed to execute ${serverName}`,
                        error: error.message,
                        domain: 'ammcpserver.vercel.app'
                    });
                }
                break;
            
            case 'list':
                res.json({ 
                    success: true, 
                    message: 'Available MCP servers',
                    servers: Object.keys(mcpConfig.mcpServers),
                    domain: 'ammcpserver.vercel.app'
                });
                break;
            
            default:
                res.status(400).json({ 
                    success: false, 
                    message: 'Invalid action specified',
                    domain: 'ammcpserver.vercel.app'
                });
        }
    } catch (error) {
        console.error('Process error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error',
            error: error.message,
            domain: 'ammcpserver.vercel.app'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!',
        error: err.message,
        domain: 'ammcpserver.vercel.app'
    });
});

// Export the Express app for Vercel
module.exports = app;
