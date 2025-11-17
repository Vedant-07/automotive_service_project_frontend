// jest.config.cjs
module.exports = {
  testEnvironment: "jest-environment-jsdom",

  // polyfills that must run BEFORE any module is required (import.meta polyfill + TextEncoder)
  setupFiles: ["<rootDir>/jest.polyfills.cjs"],

  // run after Jest environment is ready (jest-dom)
  setupFilesAfterEnv: ["<rootDir>/jest.setup.cjs"],

  // transform JS/JSX with babel-jest
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },

  // ensure jest finds .cjs test files and jsx
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?|cjs)$",
  moduleFileExtensions: ["js", "jsx", "json", "cjs"],

  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },

  moduleDirectories: ["node_modules", "src"],
};
