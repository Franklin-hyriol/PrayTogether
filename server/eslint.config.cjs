const js = require("@eslint/js");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");

module.exports = [
  js.configs.recommended,

  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
        ecmaVersion: 2021,
      },
      globals: {
        process: "readonly",
        console: "readonly",
        __dirname: "readonly",
        module: "readonly",
        require: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "no-var": "error",
      "prefer-const": "error",
      "no-duplicate-imports": "error",
    },
  },

  {
    ignores: ["dist/**", "node_modules/**", "eslint.config.*"],
  },
];


/*
rules: {
      // Règles TypeScript importantes
      '@typescript-eslint/no-unused-vars': 'error',         // Erreur si variable non utilisée
      '@typescript-eslint/no-explicit-any': 'warn',         // Avertissement si utilisation de type "any"
      '@typescript-eslint/explicit-function-return-type': 'warn', // Avertir si pas de type de retour explicite
      '@typescript-eslint/no-floating-promises': 'error',   // Erreur si promesse non gérée
      '@typescript-eslint/strict-boolean-expressions': 'warn', // Avertir si conditions booléennes douteuses

      // Règles JS classiques pour la qualité du code
      'eqeqeq': 'error',           // Forcer l'utilisation de === et !==
      'curly': 'error',            // Exiger les accolades pour tous les blocs conditionnels
      'no-console': 'warn',        // Avertir en cas d'utilisation de console.log (à limiter en prod)
      'no-var': 'error',           // Interdire 'var', préférer let/const
      'prefer-const': 'error',     // Préférer const si variable non modifiée
      'consistent-return': 'warn', // Avertir si fonction retourne parfois une valeur et parfois pas
      'no-else-return': 'warn',    // Avertir quand un else suit un return (inutile)
      'no-duplicate-imports': 'error', // Interdire les imports en double du même module

      // Organisation des imports
      'import/order': ['error', { 'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'] }],

      // Limite la longueur des lignes à 120 caractères (warning)
      'max-len': ['warn', { code: 120 }],

      // Sécurité : éviter les fonctions dangereuses ou mauvaises pratiques
      'no-eval': 'error',          // Interdire eval()
      'no-implied-eval': 'error',  // Interdire setTimeout/setInterval avec string
      'no-unsafe-finally': 'error',// Empêcher les erreurs dans un bloc finally
      'no-throw-literal': 'error', // Forcer à throw des Error objects
      'no-process-exit': 'warn',   // Avertir contre process.exit() brutal sauf cas justifié
      'no-path-concat': 'error',   // Interdire concaténation manuelle des chemins (utiliser path.join)

      // Node.js spécifique : empêcher import de modules non installés (éviter oublis dans package.json)
      'node/no-unpublished-import': 'error',

      // Express.js : règles spécifiques pour éviter erreurs courantes
      'express/no-req-res-in-next': 'error',          // Interdire de passer req/res à next()
      'express/no-duplicate-middleware': 'error',    // Interdire middleware dupliqués
      'express/no-middleware-after-response': 'error', // Interdire middleware après envoi réponse
    },
    */
