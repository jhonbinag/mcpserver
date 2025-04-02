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

// MCP Command Handlers
const mcpHandlers = {
    'server-sequential-thinking': async (data) => {
        return executeMCPCommand('server-sequential-thinking', {
            ...data,
            key: mcpConfig.mcpServers['server-sequential-thinking'].args[5]
        });
    },
    'perplexity-deep-research': async (data) => {
        return executeMCPCommand('perplexity-deep-research', {
            ...data,
            key: mcpConfig.mcpServers['perplexity-deep-research'].args[5]
        });
    },
    'github': async (data) => {
        return executeMCPCommand('github', {
            ...data,
            key: mcpConfig.mcpServers['github'].args[5]
        });
    },
    'claude-code-mcp': async (data) => {
        return executeMCPCommand('claude-code-mcp', {
            ...data,
            config: mcpConfig.mcpServers['claude-code-mcp'].args[5]
        });
    },
    'n8n-workflow-builder': async (data) => {
        return executeMCPCommand('n8n-workflow-builder', {
            ...data,
            key: mcpConfig.mcpServers['n8n-workflow-builder'].args[5]
        });
    },
    'fetch-mcp': async (data) => {
        return executeMCPCommand('fetch-mcp', {
            ...data,
            key: mcpConfig.mcpServers['fetch-mcp'].args[5]
        });
    },
    'smart-thinking': async (data) => {
        return executeMCPCommand('smart-thinking', {
            ...data,
            key: mcpConfig.mcpServers['smart-thinking'].args[5]
        });
    },
    'react-mcp': async (data) => {
        return executeMCPCommand('react-mcp', {
            ...data,
            config: mcpConfig.mcpServers['react-mcp'].args[5]
        });
    }
};

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

        console.log(`Executing MCP command: ${command} ${args.join(' ')}`);

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

// Specific MCP endpoints
app.post('/api/sequential-thinking', async (req, res) => {
    try {
        const result = await mcpHandlers['server-sequential-thinking'](req.body);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/perplexity-research', async (req, res) => {
    try {
        const result = await mcpHandlers['perplexity-deep-research'](req.body);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/github', async (req, res) => {
    try {
        const result = await mcpHandlers['github'](req.body);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/claude-code', async (req, res) => {
    try {
        const result = await mcpHandlers['claude-code-mcp'](req.body);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/n8n-workflow', async (req, res) => {
    try {
        const result = await mcpHandlers['n8n-workflow-builder'](req.body);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/fetch', async (req, res) => {
    try {
        const result = await mcpHandlers['fetch-mcp'](req.body);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/smart-thinking', async (req, res) => {
    try {
        const result = await mcpHandlers['smart-thinking'](req.body);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/react', async (req, res) => {
    try {
        const result = await mcpHandlers['react-mcp'](req.body);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
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

                const handler = mcpHandlers[serverName];
                if (!handler) {
                    res.status(400).json({ 
                        success: false, 
                        message: `No handler found for server: ${serverName}`,
                        domain: 'ammcpserver.vercel.app'
                    });
                    return;
                }

                try {
                    const result = await handler(data);
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
