# wrap

[![Version Badge][version-image]][project-url]
[![Build Status][build-image]][build-url]
[![Dependencies][dependencies-image]][project-url]
[![License][license-image]][license-url]
[![File Size][file-size-image]][project-url]

> Variable wrapper utility

## Usage

Wrap a variable to provide abstracted utilities:

``` javascript
import wrap from 'wrap';

const value = wrap('foo');
```

Get and set the internal variable:

``` javascript
const value = wrap();

value.set('bar');
value.get(); //=> "bar"
```

Get the type of the variable or type check it:

``` javascript
const value = wrap(false);

value.type(); //=> "boolean"
value.is('number'); //=> false
```

Make assertions on the value:

``` javascript
const value = wrap(100);

value.assert((val) => val < 200); //=> true
```

Watch for changes:

``` javascript
const value = wrap('foo');

value.observe((val) => console.log(val));

// Setting the value triggers all observers
value.set('bar');
```

Determine if the internal variable is strictly equal to another value:

``` javascript
const value = wrap('foo');

value.equals('foo'); //=> true
```

Implements the [_iterable protocol_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterable) for arrays and objects, enabling `for...of` loops:

``` javascript
const object = wrap({foo: 1, bar: 2, baz: 3});
for (const [key, value] of object) {
    // do something
}

const array = wrap([1, 2, 3]);
for (const value of array) {
    // do something
}
```

Convert the value to JSON:

``` javascript
const value = wrap({foo: 1, bar: 2});

value.toJSON(); //=> '{"foo":1,"bar":2}'
JSON.stringify(value); //=> "{\"foo\":1,\"bar\":2}"
```

Generate a unique integer representation of the internal variable based on its value:

``` javascript
const value = wrap([1, 2, 3]);

value.hashCode(); //=> 5055
```

Clone the variable:

``` javascript
const object = {foo: 1, bar: 2};
const value = wrap(object);

const copy = value.clone();

object === copy; //=> false;
object.foo === copy.foo; //=> true;
object.bar === copy.bar; //=> true;
```

Log to the console and throw errors:

``` javascript
const value = wrap('foo');

value.log('Initialized');
value.error('Error!');
```

Turn on debugging mode (injects the `debugger` statement):

``` javascript
const value = wrap(123);

// Turn on debugging mode
value.debug()

// Creates a breakpoint anytime the value is read or changed
value.set(456);
value.get();

// Turn off debugging mode
value.debug(false);
```

Get a string representation of the internal variable or coerce into a primitive value (returns same as `hashCode`):

``` javascript
const value = wrap('foo');

value.toString(); //=> "foo"
value + ""; //=> "foo"

value.valueOf(); //=> 101574
value + 10; // 101584
```

Nullify the reference to the internal variable

``` javascript
const value = wrap('foo');

value.get(); //=> "foo"
value.release();
value.get(); //=> null
```

## Installation

Wrap is [CommonJS](http://www.commonjs.org/) and [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) compatible with no dependencies. You can download the [development](http://github.com/ryanmorr/wrap/raw/master/dist/wrap.js) or [minified](http://github.com/ryanmorr/wrap/raw/master/dist/wrap.min.js) version, or install it in one of the following ways:

``` sh
npm install ryanmorr/wrap

bower install ryanmorr/wrap
```

## Tests

Run unit tests by issuing the following commands:

``` sh
npm install
npm install -g gulp
gulp test
```

## License

This project is dedicated to the public domain as described by the [Unlicense](http://unlicense.org/).

[project-url]: https://github.com/ryanmorr/wrap
[version-image]: https://badge.fury.io/gh/ryanmorr%2Fwrap.svg
[build-url]: https://travis-ci.org/ryanmorr/wrap
[build-image]: https://travis-ci.org/ryanmorr/wrap.svg
[dependencies-image]: https://david-dm.org/ryanmorr/wrap.svg
[license-image]: https://img.shields.io/badge/license-Unlicense-blue.svg
[license-url]: UNLICENSE
[file-size-image]: https://badge-size.herokuapp.com/ryanmorr/wrap/master/dist/wrap.min.js.svg?color=blue&label=file%20size