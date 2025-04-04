// frontend/jest.config.js
module.exports = {
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
    moduleNameMapper: {
      '^axios$': '<rootDir>/src/__mocks__/axios.js'
    },
    transform: {
      '^.+\\.jsx?$': 'babel-jest'
    }
  };
  