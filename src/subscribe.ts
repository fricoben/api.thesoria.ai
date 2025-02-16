import { Router } from 'express';

const router = Router();

const NOTION_API_URL = 'https://api.notion.com/v1';

// Add debug logging for initialization
console.log('🔄 Initializing Notion configuration:', {
    apiKeyExists: !!process.env.NOTION_API_KEY,
    apiKeyLength: process.env.NOTION_API_KEY?.length,
    databaseId: process.env.NOTION_DATABASE_ID
});

interface NotionPageResponse {
    object: 'page';
    id: string;
    created_time: string;
    last_edited_time: string;
    parent: {
        type: 'database_id';
        database_id: string;
    };
    properties: {
        [key: string]: any; // We can be less strict here since we don't need all properties
    };
    url: string;
}

router.post('/subscribe', async (req, res) => {
    try {
        const { name, email } = req.body;
        console.log('📝 Received subscription request:', { name, email });

        if (!name || !email) {
            console.log('❌ Missing required fields');
            res.status(400).json({ message: 'Name and email are required' });
            return;
        }

        try {
            console.log('🔍 Attempting to create Notion page...');
            const response = await fetch(`${NOTION_API_URL}/pages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    parent: {
                        database_id: process.env.NOTION_DATABASE_ID,
                    },
                    properties: {
                        Name: {
                            title: [
                                {
                                    text: {
                                        content: name,
                                    },
                                },
                            ],
                        },
                        Email: {
                            email: email,
                        },
                        Time: {
                            date: {
                                start: new Date().toISOString(),
                            },
                        },
                    },
                }),
            });

            if (!response.ok) {
                const errorData = await response.json() as { message?: string };
                console.error('❌ Notion API Error:', {
                    status: response.status,
                    error: errorData
                });

                if (response.status === 401) {
                    res.status(500).json({
                        message: "Erreur de configuration avec Notion. Veuillez contacter l'administrateur.",
                        error: errorData
                    });
                    return;
                }
                throw new Error(`Notion API error: ${response.status}`);
            }

            const data = await response.json() as NotionPageResponse;
            console.log('✅ Successfully created Notion page:', data.id);
            res.status(200).json({ message: 'Inscription réussie!' });
            return;
        } catch (notionError) {
            console.error('❌ Notion API Error:', notionError);
            throw notionError;
        }
    } catch (error) {
        console.error('❌ General Error:', error);
        res.status(500).json({ message: "Erreur lors de l'inscription" });
        return;
    }
});

export default router; 