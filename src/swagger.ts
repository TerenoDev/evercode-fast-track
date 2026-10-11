export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Crypto Tracker API',
    version: '1.0.0',
    description: 'API для отслеживания и агрегации курсов криптовалют с CoinMarketCap',
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Local server' },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'API Key',
      },
    },
    schemas: {
      Coin: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          symbol: { type: 'string' },
          added_at: { type: 'string', format: 'date-time' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
    },
  },
  security: [{ BearerAuth: [] }],
  paths: {
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Health check',
        security: [],
        responses: {
          '200': { description: 'Server is OK' },
        },
      },
    },
    '/api/coins': {
      get: {
        tags: ['Coins'],
        summary: 'Get all tracked coins',
        responses: {
          '200': {
            description: 'List of coins',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Coin' } },
              },
            },
          },
          '401': { description: 'Unauthorized' },
        },
      },
      post: {
        tags: ['Coins'],
        summary: 'Add a new coin to tracking',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { symbol: { type: 'string', example: 'BTC' } },
                required: ['symbol'],
              },
            },
          },
        },
        responses: {
          '201': { description: 'Coin added' },
          '400': { description: 'Validation error' },
          '409': { description: 'Coin already tracked' },
        },
      },
    },
    '/api/coins/{id}': {
      delete: {
        tags: ['Coins'],
        summary: 'Delete a coin from tracking',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '204': { description: 'Coin deleted' },
          '404': { description: 'Coin not found' },
        },
      },
    },
    '/api/coins/{symbol}/price': {
      get: {
        tags: ['Prices'],
        summary: 'Get current price for a coin',
        parameters: [
          { name: 'symbol', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Current price' },
          '404': { description: 'Coin is not tracked' },
          '502': { description: 'External API error' },
        },
      },
    },
    '/api/coins/{symbol}/history': {
      get: {
        tags: ['Prices'],
        summary: 'Get price history for a coin',
        parameters: [
          { name: 'symbol', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Price history' },
          '404': { description: 'Coin is not tracked' },
        },
      },
    },
  },
};