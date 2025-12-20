import js from "@eslint/js";
import globals from "globals";
import prettierPlugin from "eslint-plugin-prettier";
import configPrettier from "eslint-config-prettier";

export default [
  // 1. Apply to all JS files
  {
    files: ["**/*.{js,mjs,cjs}"],
    // Incorporate the recommended base rules
    ...js.configs.recommended,
  },

  // 2. Main Configuration Block
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest, // Added this so ESLint doesn't cry about 'test' or 'expect'
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // --- Your Manual Logic Rules ---
      "no-unused-vars": "warn",
      "no-undef": "error",
      eqeqeq: "error",
      "no-console": "off", // Keep off for practice, change to "warn" for real projects

      // --- Prettier Integration ---
      "prettier/prettier": "error", // Report formatting issues as ESLint errors
    },
  },

  // 3. The "Peacekeeper" (MUST BE LAST)
  configPrettier,
];
