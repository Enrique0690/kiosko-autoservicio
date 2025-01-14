module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        [
          'module-resolver',
          {
            alias: {
              fs: './empty.js',
              electron: './empty.js',
            },
          },
        ],
      ],
    };
  };
  