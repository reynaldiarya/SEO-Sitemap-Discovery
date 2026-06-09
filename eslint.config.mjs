import eslint from '@eslint/js';
import tseslint, { configs as tsConfigs } from 'typescript-eslint';
import eslintPluginImportX, { flatConfigs } from 'eslint-plugin-import-x';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import process from 'node:process';

export default tseslint.config(
  // Global ignores
  {
    ignores: ['dist/', 'node_modules/'],
  },

  // Base configs
  eslint.configs.recommended,
  ...tsConfigs.recommended,
  flatConfigs.recommended,
  flatConfigs.typescript,

  // TypeScript files configuration
  {
    files: ['**/*.ts', '**/*.mts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
      parserOptions: {
        project: false, // set ke tsconfig.json jika ingin rules type-aware
      },
    },
    plugins: {
      import: eslintPluginImportX,
    },
    settings: {
      'import/resolver': {
        node: { extensions: ['.ts', '.js', '.mjs'] },
        typescript: true,
      },
    },
    rules: {
      // Typescript
      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // Import hygiene
      'import/order': [
        'warn',
        {
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
        },
      ],
      'import/no-unresolved': 'error',

      // Style (delegasikan ke Prettier)
      'prefer-const': 'warn',
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    },
  },

  // Config files override
  {
    files: ['*.config.*'],
    rules: {
      'import/no-unresolved': 'off',
    },
  },

  // Test files override
  {
    files: ['**/*.test.ts', '**/__tests__/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  eslintConfigPrettier
);
