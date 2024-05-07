const eslint = require("@eslint/js");
const globals = require("globals");
const tseslint = require('typescript-eslint');

module.exports = [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            }
        },
        rules: {
            "@typescript-eslint/no-var-requires": "off",
        }
    }
];
