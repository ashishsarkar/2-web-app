import '@testing-library/jest-dom';

// MSW server for integration tests (intercepts API calls when baseURL is http://localhost)
const { setupServer } = require('msw/node');
const { handlers } = require('./mocks/handlers');

const server = setupServer(...handlers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

// Expose for integration tests that need to override handlers
global.mswServer = server;
