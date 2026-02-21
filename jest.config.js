const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/components/**/*.{js,jsx}',
    'src/lib/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
  ],
  coverageThreshold: {
    global: {
      lines: 80,
    },
  },
};

module.exports = createJestConfig(config);
