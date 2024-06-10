module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./jest.setup.js'],
    testMatch: ['**/tests/unit/**/*.test.ts']
  };
  