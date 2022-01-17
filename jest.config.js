const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["./jest.setup.js"],
  moduleDirectories: ["node_modules", "./"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/components/(.*)$": "src/components/$1",
    "^@/lib/(.*)$": "lib/$1",
    "^@/translations/(.*)$": "src/translations/$1",
    "^@/utils/(.*)$": "src/utils/$1",
    "^@/icons/(.*)$": "src/icons/$1",
    "^@/src/(.*)$": "src/$1",
  },
};

module.exports = createJestConfig(customJestConfig);
