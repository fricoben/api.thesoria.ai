import express from 'express';
import cors from 'cors';
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

// CORS middleware
app.use(cors({
    origin: ['https://thesoriaai.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

app.use('/', subscribeRouter);

app.get('/test-cors', (req, res) => {
    res.json({ message: 'CORS is working!' });
});

// Add this if you want to run the server locally
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`🚀 Server running on port ${port}`);
    });
}

export const handler = app; 