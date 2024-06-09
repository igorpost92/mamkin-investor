const path = require('path');

module.exports = {
  plugins: [
    'postcss-nested',
    [
      'postcss-mixins',
      {
        mixinsDir: [
          // TODO: should copy kit's mixins in order to use it locally
          path.join(__dirname, 'node_modules/mobile-kit/mixins'),
          // path.join(__dirname, 'src/mixins'),
        ],
      },
    ],
    // 'postcss-preset-mantine',
    // [
    //   'postcss-simple-vars',
    //   {
    //     variables: {
    //       'mantine-breakpoint-xs': '36em',
    //       'mantine-breakpoint-sm': '48em',
    //       'mantine-breakpoint-md': '62em',
    //       'mantine-breakpoint-lg': '75em',
    //       'mantine-breakpoint-xl': '88em',
    //     },
    //   },
    // ],
  ],
};
