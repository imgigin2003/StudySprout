import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,

  {
    files: ["**/*.js"],
    languageOptions: {
      globals: globals.node,
      ecmaVersion: "latest",
    },
    rules: {
      // Custom rules you might like for backend
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "warn",
      eqeqeq: "error",
      curly: "warn",
    },
  },

  {
    ignores: ["node_modules/", "dist/", "build/", "logs/"],
  },
];
