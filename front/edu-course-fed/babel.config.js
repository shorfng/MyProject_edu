module.exports = function (api) {
    api.cache(true);
    const presets = [
      [
        '@babel/preset-env',
        {
          modules: false,
        }
      ]
    ];
    const plugins = [
      [
        '@babel/plugin-transform-runtime', {
            corejs: 2,
            helpers: true,
            regenerator: true,
            useESModules: false
        }
      ],
      [
        'component',
        {
          'libraryName': 'element-ui',
          'styleLibraryName': 'theme-chalk'
        }
      ],
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-syntax-import-meta',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-json-strings',
      '@babel/plugin-transform-modules-commonjs',
      [
        '@babel/plugin-proposal-decorators',
        {
          'legacy': true
        }
      ],
      '@babel/plugin-proposal-function-sent',
      '@babel/plugin-proposal-export-namespace-from',
      '@babel/plugin-proposal-numeric-separator',
      '@babel/plugin-proposal-throw-expressions',
      '@babel/plugin-proposal-export-default-from',
      '@babel/plugin-proposal-logical-assignment-operators',
      '@babel/plugin-proposal-optional-chaining',
      [
        '@babel/plugin-proposal-pipeline-operator',
        {
          'proposal': 'minimal'
        }
      ],
      '@babel/plugin-proposal-nullish-coalescing-operator',
      '@babel/plugin-proposal-do-expressions',
      '@babel/plugin-proposal-function-bind',
      '@babel/plugin-transform-object-assign'
    ];
    return {
      presets,
      plugins
    };
  };
