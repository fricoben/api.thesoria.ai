# Thesoria API

A Node.js Express server with Notion integration for handling subscriptions.

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Create a `.env` file in the root directory with the following variables:
```
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_notion_database_id
```

## Development

To run the server in development mode with hot-reload:
```bash
pnpm dev
```

## Production

To build and run in production:
```bash
pnpm build
pnpm start
```

## API Endpoints

### POST /subscribe
Adds a new subscriber to the Notion database.

Request body:
```json
{
  "name": "string",
  "email": "string"
}
```

Response:
- 200: Successful subscription
- 400: Missing required fields
- 500: Server error 