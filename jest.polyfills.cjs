// jest.polyfills.cjs
// Polyfills run BEFORE jest loads modules

// 1) Provide a fake Vite import.meta.env structure
global.importMetaEnv = { VITE_API_HOST: "http://localhost" };
global.__vite_import_meta__ = { env: global.importMetaEnv };
global.importMeta = { env: global.importMetaEnv }; // some code expects this

// 2) TextEncoder/TextDecoder polyfill (react-router or other libs may need this)
const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
