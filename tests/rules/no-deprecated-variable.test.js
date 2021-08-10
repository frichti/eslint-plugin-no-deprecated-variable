const { RuleTester } = require('eslint')
const rule = require('../../src/rules/no-deprecated-variable')

const options = {
  properties: [
    {
      deprecate: 'DEPRECATED_COLORS',
      matchingVariable: 'COLORS',
      matchObject: {
        primary: 'primary',
        black: 'dark[900]',
        white: 'light[900]',
        primaryHover: 'primary',
        primaryBorder: 'primary',
        secondary: 'warning[500]',
        secondaryHover: 'warning[100]',
        blush: 'negative[500]',
        success: 'positive[500]',
        dark: 'dark[900]',
        darkHover: 'gray[500]',
        standard: 'gray[300]',
        standardAlternate: 'gray[200]',
      }
    },
    {
      deprecate: 'typoSomething',
      matchingVariable: 'typoGoodThing',
    }
  ]
}

const optionsWithoutMatching = {
  properties: [{
    deprecate: 'DEPRECATED_COLORS',
  }]
}

const ruleTester = new RuleTester()
ruleTester.run('no-deprecated-variable', rule, {
  valid: [{
    code: `
      var color = COLORS.primary;
    `,
    options: [options]
  }, {
    code: `
      var color = COLORS.dark;
    `,
    options: [optionsWithoutMatching]
  }],
  invalid: [
    {
      code: `
        var color = DEPRECATED_COLORS.secondary;
        var hellotest = typoSomething();
      `,
      options: [options],
      errors: [{
        message: 'DEPRECATED_COLORS.secondary is deprecated, please use COLORS.warning[500]',
      }, {
        message: 'typoSomething is deprecated, please use typoGoodThing',
      }],
      output: `
        var color = COLORS.warning[500];
        var hellotest = typoGoodThing();
      `,
    },
    {
      code: `
        var hellotest = typoSomething();
      `,
      options: [options],
      errors: [{
        message: 'typoSomething is deprecated, please use typoGoodThing',
      }],
      output: `
        var hellotest = typoGoodThing();
      `,
    },
    {
      code: `
        var color = DEPRECATED_COLORS.dark;
      `,
      options: [optionsWithoutMatching],
      errors: [{
        message: 'DEPRECATED_COLORS.dark is deprecated, please do not use it',
      }],
    }
  ],
})
