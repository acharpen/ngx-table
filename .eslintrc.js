module.exports = {
  root: true,
  overrides: [
    {
      files: ['*.html'],
      extends: ['plugin:@angular-eslint/template/recommended']
    },
    {
      files: ['*.ts'],
      extends: [
        'plugin:@angular-eslint/recommended',
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking'
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: 'tsconfig.json'
      },
      plugins: ['@typescript-eslint'],
      rules: {
        camelcase: 'off',
        'array-callback-return': ['error'],
        'block-scoped-var': ['error'],
        'consistent-return': ['error'],
        'default-case-last': ['error'],
        'default-param-last': 'off',
        'dot-notation': 'off',
        eqeqeq: ['error', 'always', { null: 'ignore' }],
        'grouped-accessor-pairs': ['error'],
        'guard-for-in': ['error'],
        'max-classes-per-file': ['error', 1],
        'no-alert': ['error'],
        'no-await-in-loop': ['error'],
        'no-caller': ['error'],
        'no-case-declarations': ['error'],
        'no-confusing-arrow': ['error'],
        'no-console': ['error'],
        'no-constructor-return': ['error'],
        'no-div-regex': ['error'],
        'no-dupe-class-members': 'off',
        'no-dupe-else-if': ['error'],
        'no-duplicate-imports': 'off',
        'no-else-return': ['error'],
        'no-empty': ['error'],
        'no-empty-function': ['off'],
        'no-eval': ['error'],
        'no-extend-native': ['error'],
        'no-extra-bind': ['error'],
        'no-extra-boolean-cast': ['error', { enforceForLogicalOperands: true }],
        'no-extra-label': ['error'],
        'no-floating-decimal': ['error'],
        'no-implicit-coercion': ['error'],
        'no-implicit-globals': ['error'],
        'no-implied-eval': ['error'],
        'no-invalid-this': 'off',
        'no-iterator': ['error'],
        'no-labels': ['error'],
        'no-label-var': ['error'],
        'no-lone-blocks': ['error'],
        'no-loop-func': 'off',
        'no-loss-of-precision': 'off',
        'no-multi-str': ['error'],
        'no-new': ['error'],
        'no-new-func': ['error'],
        'no-new-wrappers': ['error'],
        'no-octal-escape': ['error'],
        'no-param-reassign': ['error'],
        'no-promise-executor-return': ['error'],
        'no-proto': ['error'],
        'no-prototype-builtins': ['error'],
        'no-redeclare': 'off',
        'no-restricted-exports': ['error'],
        'no-restricted-globals': ['error'],
        'no-restricted-imports': ['error'],
        'no-restricted-properties': ['error'],
        'no-return-assign': ['error'],
        'no-return-await': 'off',
        'no-script-url': ['error'],
        'no-self-assign': ['error'],
        'no-self-compare': ['error'],
        'no-sequences': ['error'],
        'no-shadow': 'off',
        'no-template-curly-in-string': ['error'],
        'no-throw-literal': ['error'],
        'no-undefined': 'off',
        'no-undef-init': ['error'],
        'no-unmodified-loop-condition': ['error'],
        'no-unreachable-loop': ['error'],
        'no-unused-expressions': 'off',
        'no-use-before-define': 'off',
        'no-useless-backreference': ['error'],
        'no-useless-call': ['error'],
        'no-useless-computed-key': ['error'],
        'no-useless-concat': ['error'],
        'no-useless-constructor': 'off',
        'no-useless-escape': ['error'],
        'no-useless-rename': ['error'],
        'no-useless-return': ['error'],
        'no-var': ['error'],
        'no-void': ['error'],
        'no-warning-comments': ['error'],
        'object-shorthand': ['error'],
        'prefer-arrow-callback': ['error'],
        'prefer-const': ['error', { ignoreReadBeforeAssign: true }],
        'prefer-destructuring': ['error', { array: false }],
        'prefer-named-capture-group': ['off'],
        'prefer-numeric-literals': ['error'],
        'prefer-promise-reject-errors': ['error'],
        'prefer-regex-literals': ['error'],
        'prefer-rest-params': ['error'],
        'prefer-spread': ['error'],
        'prefer-template': ['error'],
        radix: ['error'],
        'require-atomic-updates': ['error'],
        'require-await': 'off',
        'require-unicode-regexp': ['off'],
        'sort-imports': 'off',
        'symbol-description': ['error'],
        'vars-on-top': ['error'],
        yoda: ['error'],

        '@angular-eslint/directive-class-suffix': ['off'],
        '@angular-eslint/no-empty-lifecycle-method': ['error'],
        '@angular-eslint/no-input-rename': ['error'],
        '@angular-eslint/no-output-on-prefix': ['error'],

        '@typescript-eslint/array-type': ['error', { default: 'array' }],
        '@typescript-eslint/ban-ts-comment': ['error'],
        '@typescript-eslint/ban-types': ['error'],
        '@typescript-eslint/class-literal-property-style': 'off',
        '@typescript-eslint/consistent-indexed-object-style': ['error'],
        '@typescript-eslint/consistent-type-assertions': [
          'error',
          { assertionStyle: 'as', objectLiteralTypeAssertions: 'never' }
        ],
        '@typescript-eslint/default-param-last': ['error'],
        '@typescript-eslint/dot-notation': ['error'],
        '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
        '@typescript-eslint/explicit-member-accessibility': ['error'],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/member-ordering': [
          'error',
          {
            default: [
              // Index signature
              'signature',
              'call-signature',

              // Fields
              'public-static-field',
              'protected-static-field',
              'private-static-field',
              '#private-static-field',

              'public-decorated-field',
              'protected-decorated-field',
              'private-decorated-field',

              'public-instance-field',
              'protected-instance-field',
              'private-instance-field',
              '#private-instance-field',

              'public-abstract-field',
              'protected-abstract-field',

              'public-field',
              'protected-field',
              'private-field',
              '#private-field',

              'static-field',
              'instance-field',
              'abstract-field',

              'decorated-field',

              'field',

              // Static initialization
              'static-initialization',

              // Constructors
              'public-constructor',
              'protected-constructor',
              'private-constructor',

              'constructor',

              // Methods
              'public-static-method',
              'protected-static-method',
              'private-static-method',
              '#private-static-method',

              'public-decorated-method',
              'protected-decorated-method',
              'private-decorated-method',

              'public-instance-method',
              'protected-instance-method',
              'private-instance-method',
              '#private-instance-method',

              'public-abstract-method',
              'protected-abstract-method',

              'public-method',
              'protected-method',
              'private-method',
              '#private-method',

              'static-method',
              'instance-method',
              'abstract-method',

              'decorated-method',

              'method'
            ]
          }
        ],
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'enumMember',
            format: ['UPPER_CASE']
          },
          {
            selector: 'memberLike',
            modifiers: ['private'],
            format: ['camelCase'],
            leadingUnderscore: 'require'
          },
          {
            selector: 'parameter',
            format: ['camelCase'],
            leadingUnderscore: 'allow'
          },
          {
            selector: 'property',
            modifiers: ['static'],
            format: ['UPPER_CASE']
          },
          {
            selector: 'typeLike',
            format: ['PascalCase']
          }
        ],
        '@typescript-eslint/no-array-constructor': ['error'],
        '@typescript-eslint/no-base-to-string': ['error'],
        '@typescript-eslint/no-confusing-non-null-assertion': ['error'],
        '@typescript-eslint/no-dupe-class-members': ['error'],
        '@typescript-eslint/no-duplicate-imports': ['error'],
        '@typescript-eslint/no-dynamic-delete': ['error'],
        '@typescript-eslint/no-empty-function': ['error'],
        '@typescript-eslint/no-implicit-any-catch': ['error'],
        '@typescript-eslint/no-inferrable-types': ['error'],
        '@typescript-eslint/no-invalid-this': ['error'],
        '@typescript-eslint/no-invalid-void-type': ['error', { allowInGenericTypeArguments: true }],
        '@typescript-eslint/no-loop-func': ['error'],
        '@typescript-eslint/no-loss-of-precision': ['error'],
        '@typescript-eslint/no-non-null-assertion': ['off'],
        '@typescript-eslint/no-parameter-properties': 'off',
        '@typescript-eslint/no-redeclare': ['error'],
        '@typescript-eslint/no-require-imports': ['error'],
        '@typescript-eslint/no-shadow': ['error'],
        '@typescript-eslint/no-throw-literal': ['error'],
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': ['error'],
        '@typescript-eslint/no-unnecessary-condition': ['error', { allowConstantLoopConditions: true }],
        '@typescript-eslint/no-unnecessary-qualifier': ['error'],
        '@typescript-eslint/no-unnecessary-type-arguments': ['error'],
        '@typescript-eslint/no-unnecessary-type-assertion': ['error'],
        '@typescript-eslint/no-unsafe-assignment': ['error'],
        '@typescript-eslint/no-unsafe-call': ['error'],
        '@typescript-eslint/no-unsafe-member-access': ['error'],
        '@typescript-eslint/no-unsafe-return': ['error'],
        '@typescript-eslint/no-unused-expressions': ['error'],
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-use-before-define': ['error'],
        '@typescript-eslint/no-useless-constructor': ['error'],
        '@typescript-eslint/prefer-function-type': ['error'],
        '@typescript-eslint/prefer-includes': ['error'],
        '@typescript-eslint/prefer-literal-enum-member': ['error'],
        '@typescript-eslint/prefer-nullish-coalescing': ['error'],
        '@typescript-eslint/prefer-optional-chain': ['error'],
        '@typescript-eslint/prefer-readonly': ['error'],
        '@typescript-eslint/prefer-reduce-type-parameter': ['error'],
        '@typescript-eslint/prefer-regexp-exec': ['error'],
        '@typescript-eslint/prefer-string-starts-ends-with': ['error'],
        '@typescript-eslint/prefer-ts-expect-error': ['error'],
        '@typescript-eslint/promise-function-async': ['error'],
        '@typescript-eslint/require-array-sort-compare': ['error'],
        '@typescript-eslint/restrict-plus-operands': ['error'],
        '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
        '@typescript-eslint/return-await': 'error',
        '@typescript-eslint/strict-boolean-expressions': ['error'],
        '@typescript-eslint/switch-exhaustiveness-check': ['error'],
        '@typescript-eslint/typedef': ['error'],
        '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],
        '@typescript-eslint/unified-signatures': ['error']
      }
    }
  ]
};
