# react-clipboard-polyfill (snazzy title, eh?)



[![Build Status](https://travis-ci.org/jongrim/react-clipboard-polyfill.svg?branch=master)](https://travis-ci.org/jongrim/react-clipboard-polyfill)

[![codecov](https://codecov.io/gh/jongrim/react-clipboard-polyfill/branch/master/graph/badge.svg)](https://codecov.io/gh/jongrim/react-clipboard-polyfill)

```jsx
import Clipboard from 'react-clipboard-polyfill';

const MyComponent = () => (
  <Clipboard
    render={({ copyText }) => (
      <div onClick={() => copyText('Your text here').then(() => anythingYouWant())} />
    )}
  />
)
```

A versatile clipboard component for copying text or other data to the user's clipboard on the web. It is a wrapper around the excellent [clipboard-polyfill](https://github.com/lgarron/clipboard-polyfill) and supports a variety of usage methods so that you can use the patterns your prefer.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing

This module is distributed with [npm](https://npmjs.org) which comes with [node](https://nodejs.org). It is a [React](https://reactjs.org) component that is meant to be included in an existing project. You should add it to your project's dependencies like so:

```
npm i --save react-clipboard-polyfill
```

Once installed, import or require it wherever you need it!

```jsx
import Clipboard from 'react-clipboard-polyfill'
...
const Clipboard = require('Clipboard');
```

I'm only distributing CommonJS and ESM bundles at the moment. If you need a different format, leave an issue and let me know!

**A note on Promises**

The package `clipboard-polyfill` provides an asynchronous clipboard API using promises. As such, the author chose to bundle [`es6-promise polyfill`](https://github.com/stefanpenner/es6-promise) with it so that it would be usable in older browsers. Since this package bundles `clipboard-polyfill`, you in turn also receive the polyfill.

### Usage

`Clipboard` is a standalone component that comes bundled with [clipboard-polyfill](https://github.com/lgarron/clipboard-polyfill). It wraps its methods in a way that is convenient to use within React. The component supports three methods for accessing the copy functions and I'll discuss each next, with examples:

#### Render prop - direct access to copy functions
Use a render prop to receive the `copyText` and `copyData` methods, as well as the clipboard itself.

```jsx
import Clipboard from 'react-clipboard-polyfill';

const MyComponent = () => (
  <Clipboard
    render={({ clipboard, copyData, copyText }) => (
      <div onClick={() => copyText('test').then(() => anythingYouWant())} />
    )}
  />
)
```

```jsx
import Clipboard from 'react-clipboard-polyfill';

<Clipboard
  render={({ clipboard, copyData }) => (
    <div
      style={{ cursor: 'pointer' }}
      className="App-intro"
      onClick={() => {
        clipboard.setData('text/plain', 'whoooooooa');
        clipboard.setData('text/html', '<i>whoooooooa</i>');
        copyData();
      }}
    >
      To get started, edit <code>src/App.js</code> and save to reload.
    </div>
  )}
/>
```

#### Component prop - direct access to copy functions
Works just like the render prop, but you can provide a component which will be rendered with the `copyText` and `copyData` functions, the `clipboard` object, and with any other props that were added to `Clipboard`.

```jsx
import Clipboard from 'react-clipboard-polyfill';

const Button = ({ copyText, copyData }) => (
  <button onClick={() => copyText('test').then(() => done())}>button</button>
);

const MyComponent = () => (
  <Clipboard component={Button} />
)
```

#### Compose over children - indirect access to copy functions
You can also use `Clipboard` to automatically copy the text or data you specify when an area is clicked by composing it around your other components. If `Clipboard` is not given a render or component prop, it automatically adds an `onClick` handler and wraps its children in a div tag. Speficy the data or text to copy by passing it as props to `Clipboard`. You can add multiple type to the clipboard using the `multidata` prop.

```jsx
import Clipboard from 'react-clipboard-polyfill';

const MyComponent = () => (
  <Clipboard text="test">
    <SomeOtherComponent />
  </Clipboard>
)
```

or

```jsx
import Clipboard from 'react-clipboard-polyfill';

const MyComponent = () => (
  <Clipboard data="<i>Copy HTML!</i>" dataType="text/html">
    <SomeOtherComponent />
  </Clipboard>
)
```

If you want to respond to the copy event, you can pass a callback as an `onCopy` prop, and it will be called after the text or data is copied.

```jsx
import Clipboard from 'react-clipboard-polyfill';

const onCopy = () => alert('You got data!');

const MyComponent = () => (
  <Clipboard data="<i>Copy HTML!</i>" dataType="text/html" onCopy={onCopy}>
    <SomeOtherComponent />
  </Clipboard>
)

```

Example of setting multiple items:
```jsx
<Clipboard
  multidata={[{ dataType: 'text/html', data: '<b>test</b>' }, { dataType: 'text/plain', data: 'test' }]}
>
  Copies both types
</Clipboard>
```

## Running the tests

To run the tests locally, first make sure you've setup the local project with the following:
```
git clone git@github.com:jongrim/react-clipboard-polyfill.git
cd ./react-clipboard-polyfill
npm i
```

After the project is installed run `npm run test` from the root directory of the project. The project uses [Jest](https://facebook.github.io/jest/) and automatically produces a code coverage report!

## Deployment

To produce a build, run `npm run build` and the project will be built to the `dist` directory. The [rollup config](rollup.config.js) produces a CommonJS and ESM module bundle along with source maps. These bundles include the clipboard-polyfill dependency, but **do not** include React or ReactDOM to avoid duplicate code with consumers.

## Contributing

Please read [CODE OF CONDUCT](CODE_OF_CONDUCT.md) and then feel free to submit an issue or a pull request! I cannot promise I will accept your suggestions or changes, but I'm willing to consider it. My goal is to keep this hyper-focused on copying text / data in React in a way that is easy to use with modern patterns. Any changes to that end or that help reduce the size of the library are greatly appreciated.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments
Thanks to the following people / groups:
* clipboard-polyfill for the awesome package
* The React team for building a framework that is a joy to build with
* Anyone checking this out and using the project!

## API
### `clipboard`
A reference to the inner clipboard object. You can call `setData` on it such as defined [here](https://github.com/lgarron/clipboard-polyfill#interface).
### `copyText(text: string) => Promise(<void>)`
Copy the text passed. Returns a promise that resolves on success and rejects on failure.
### `copyData(dataType: string, data: string) => Promise(<void>)`
Copy the `data` as `dataType`. Returns a promise that resolve on success and rejects on failure.
### Render prop arguments
When `Clipboard` is given a render prop, it will call that render prop with the an object containing the `copyText` and `copyData` functions, and the `clipboard` object.
### Component prop
When `Clipboard` is given a component prop, it will render that component and pass the `copyText` and `copyData` functions, and the `clipboard` object as props under their respective name.
### Clipboard props with children
When rendering children, you may specify the following props:
#### `text: string`
The text you wish to have copied on click. If text is specified it will be copied and any values for `data` and `dataType` are ignored.
#### `data: string`
The data you wish copied, as a string. For instance, you can supply HTML, or base64 of an image. To copy data, you must also specify a `dataType`.
#### `dataType: string`
The type that corresponds with the `data` you would like to copy.
#### `multidata: [{ data, dataType }]`
You may pass an array of objects if you want to set more than one type of data for copying. Each object must have a `data` and `dataType` property. `Clipboard` will call `setData` on each before then calling `write`. This is equivalent to [this functionality](https://github.com/lgarron/clipboard-polyfill#other-data-types-eg-html).
#### `onCopy: function`
You may supply a function to be called after the copy succeeds. The function will be called with no arguments.
