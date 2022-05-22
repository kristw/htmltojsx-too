# htmltojsx-too

[![npm version](https://badge.fury.io/js/htmltojsx-too.svg)](https://badge.fury.io/js/htmltojsx-too)
![CI](https://github.com/kristw/htmltojsx-too/actions/workflows/main.yml/badge.svg)

This package is a major update from `htmltojsx`.

* reduce and use more recent dependencies.
* support TypeScript.

Some of the code were modified from:

* `htmltojsx@0.3.0` and its code in [reactjs/react-magic](https://github.com/reactjs/react-magic)
* `react@15` (`HTMLDOMPropertyConfig` and `SVGDOMPropertyConfig`)

Another major change is switching dependency from `jsdom-no-contexify` to `linkedom`.

## Installation

```sh
npm install htmltojsx-too
```

## Usage

To use the Node.js module, `require('htmltojsx-too')` and create a new instance.

```js
const HTMLtoJSX = require('htmltojsx-too').default;
const converter = new HTMLtoJSX({
  createClass: true, // Set this to false if you want the output to be jsx code.
  outputClassName: 'AwesomeComponent'
});
const output = converter.convert('<div>Hello world!</div>');
```

For the web-based version, you can use `import`

```ts
import HTMLtoJSX from 'htmltojsx-too';
```

---

## Commands

TSDX scaffolds your new library inside `/src`.

To run TSDX, use:

```bash
npm start # or yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

To do a one-off build, use `npm run build` or `yarn build`.

To run tests, use `npm test` or `yarn test`.

## Configuration

Code quality is set up for you with `prettier`, `husky`, and `lint-staged`. Adjust the respective fields in `package.json` accordingly.

### Jest

Jest tests are set up to run with `npm test` or `yarn test`.

### Bundle Analysis

[`size-limit`](https://github.com/ai/size-limit) is set up to calculate the real cost of your library with `npm run size` and visualize the bundle with `npm run analyze`.

#### Setup Files

This is the folder structure we set up for you:

```txt
/src
  index.tsx       # EDIT THIS
/test
  blah.test.tsx   # EDIT THIS
.gitignore
package.json
README.md         # EDIT THIS
tsconfig.json
```

### Rollup

TSDX uses [Rollup](https://rollupjs.org) as a bundler and generates multiple rollup configs for various module formats and build settings. See [Optimizations](#optimizations) for details.

### TypeScript

`tsconfig.json` is set up to interpret `dom` and `esnext` types, as well as `react` for `jsx`. Adjust according to your needs.

## Continuous Integration

### GitHub Actions

Two actions are added by default:

- `main` which installs deps w/ cache, lints, tests, and builds on all pushes against a Node and OS matrix
- `size` which comments cost comparison of your library on every pull request using [`size-limit`](https://github.com/ai/size-limit)

## Optimizations

Please see the main `tsdx` [optimizations docs](https://github.com/palmerhq/tsdx#optimizations). In particular, know that you can take advantage of development-only optimizations:

```js
// ./types/index.d.ts
declare var __DEV__: boolean;

// inside your code...
if (__DEV__) {
  console.log('foo');
}
```

You can also choose to install and use [invariant](https://github.com/palmerhq/tsdx#invariant) and [warning](https://github.com/palmerhq/tsdx#warning) functions.

## Module Formats

CJS, ESModules, and UMD module formats are supported.

The appropriate paths are configured in `package.json` and `dist/index.js` accordingly. Please report if any issues are found.

## Named Exports

Per Palmer Group guidelines, [always use named exports.](https://github.com/palmerhq/typescript#exports) Code split inside your React app instead of your React library.

## Including Styles

There are many ways to ship styles, including with CSS-in-JS. TSDX has no opinion on this, configure how you like.

For vanilla CSS, you can include it at the root directory and add it to the `files` section in your `package.json`, so that it can be imported separately by your users and run through their bundler's loader.

## Publishing to NPM

We recommend using [np](https://github.com/sindresorhus/np).
