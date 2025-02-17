import express from 'express';
import subscribeRouter from './subscribe';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Detailed environment logging
console.log('🔧 Environment Configuration:');
console.log('------------------------');
console.log('📝 Notion API Key Status:', {
    exists: !!process.env.NOTION_API_KEY,
    length: process.env.NOTION_API_KEY?.length || 0,
    firstChars: process.env.NOTION_API_KEY ? `${process.env.NOTION_API_KEY.substring(0, 4)}...` : 'none',
    lastChars: process.env.NOTION_API_KEY ? `...${process.env.NOTION_API_KEY.substring(process.env.NOTION_API_KEY.length - 4)}` : 'none'
});
console.log('📚 Notion Database Status:', {
    exists: !!process.env.NOTION_DATABASE_ID,
    length: process.env.NOTION_DATABASE_ID?.length || 0,
    value: process.env.NOTION_DATABASE_ID || 'none'
});
console.log('🌍 Server Environment:', {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000
});
console.log('------------------------');

const app = express();

// Add content type parsing for different formats
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`📨 Incoming ${req.method} request to ${req.path}`, {
        headers: req.headers,
        body: req.body
    });
    next();
});

// Mount the subscribe router at /subscribe explicitly
app.use('/subscribe', subscribeRouter);

// Test endpoint
app.get('/test-cors', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Add a catch-all route for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({
        message: 'Route not found',
        path: req.originalUrl,
        method: req.method
    });
});

// Add this if you want to run the server locally
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`🚀 Server running on port ${port}`);
    });
}

// Export the Express app as a serverless function handler
module.exports = app; 