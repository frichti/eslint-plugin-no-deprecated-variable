# eslint-plugin-no-deprecated-variable

[![NPM](https://img.shields.io/npm/v/eslint-plugin-no-deprecated-variable.svg)](https://www.npmjs.com/package/eslint-plugin-no-deprecated-variable) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This plugin contains a rule that helps you to disallow usage of a variable and suggest you an autofix to replace it by its matching variable name

- [eslint-plugin-no-deprecated-variable](#eslint-plugin-no-deprecated-variable)
  - [Installation](#installation)
  - [Usage](#usage)

## Installation

```bash
npm install --save-dev eslint-plugin-no-deprecated-variable
```

## Usage

Prevent usage of specific deprecated variable.

For example, we want to prevent usage of `DEPRECATED_COLORS` variable and prefer usage of `COLORS` with a matching object of preferences.

We could setup our rule like that:

```json
    "no-deprecated-variable": [
      2,
      {
        "properties": [{
          "deprecate": "DEPRECATED_COLORS",
          "matchingVariable": "COLORS",
          "matchObject": {
            "white": "light[900]",
            "secondary": "warning[500]",
          }
        }]
      }
    ],
```

With those options, the rule will trigger an error when we use `DEPRECATED_COLORS` and suggest to fix the error by replacing `DEPRECATED_COLORS.white` by `COLORS.light[900]`.

👎 Examples of incorrect code for this rule (defined as above):

```js
  /**
   * BAD
  */
  // file.js
  var color = DEPRECATED_COLORS.white;
```

👍 Examples of correct code for this rule (defined as above):

```js
  /**
   * GOOD
  */
  // file.js
  var color = COLORS.light[900];
```
