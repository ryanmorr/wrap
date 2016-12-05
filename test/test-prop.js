/* eslint-disable max-len */

import { expect } from 'chai';
import sinon from 'sinon';
import prop from '../src/prop';

describe('prop', () => {
    it('should support wrapping a variable in the prop utility', () => {
        const foo = prop('foo');
        expect(foo).to.be.a('function');
    });

    it('should support reading the internal variable', () => {
        const foo = prop('foo');
        expect(foo()).to.equal('foo');
    });

    it('should support setting the internal variable', () => {
        const foo = prop('foo');
        expect(foo('bar')).to.equal('bar');
        expect(foo()).to.equal('bar');
    });

    it('should support retrieving the type of the internal variable', () => {
        const foo = prop('foo');
        expect(foo.type()).to.equal('string', 'should detect strings');
        foo(1);
        expect(foo.type()).to.equal('number', 'should detect numbers');
        foo(true);
        expect(foo.type()).to.equal('boolean', 'should detect booleans');
        foo([]);
        expect(foo.type()).to.equal('array', 'should detect arrays');
        foo({});
        expect(foo.type()).to.equal('object', 'should detect objects');
        foo(() => {});
        expect(foo.type()).to.equal('function', 'should detect functions');
        foo(/foo/);
        expect(foo.type()).to.equal('regexp', 'should detect regular expressions');
        foo(new Date());
        expect(foo.type()).to.equal('date', 'should detect dates');
        foo(null);
        expect(foo.type()).to.equal('null', 'should detect null');
        foo(void 0);
        expect(foo.type()).to.equal('undefined', 'should detect undefined');
    });

    it('should support comparing the type of the internal variable against a provided type', () => {
        const foo = prop('foo');
        expect(foo.is('string')).to.equal(true, 'should detect strings');
        foo(1);
        expect(foo.is('number')).to.equal(true, 'should detect numbers');
        foo(true);
        expect(foo.is('boolean')).to.equal(true, 'should detect booleans');
        foo([]);
        expect(foo.is('array')).to.equal(true, 'should detect arrays');
        foo({});
        expect(foo.is('object')).to.equal(true, 'should detect objects');
        foo(() => {});
        expect(foo.is('function')).to.equal(true, 'should detect functions');
        foo(/foo/);
        expect(foo.is('regexp')).to.equal(true, 'should detect regular expressions');
        foo(new Date());
        expect(foo.is('date')).to.equal(true, 'should detect dates');
        foo(null);
        expect(foo.is('null')).to.equal(true, 'should detect null');
        foo(void 0);
        expect(foo.is('undefined')).to.equal(true, 'should detect undefined');
    });

    it('should support strict equality comparison to a provided object', () => {
        const foo = prop('foo');
        expect(foo.equals('foo')).to.equal(true);
        expect(foo.equals('bar')).to.equal(false);
        expect(foo.equals(false)).to.equal(false);
    });

    it('should support nullifying the internal variable', () => {
        const foo = prop('foo');
        foo.release();
        expect(foo()).to.equal(null);
    });

    it('should support converting the internal variable to JSON', () => {
        const obj = prop({foo: 1, bar: 2});
        const json = obj.toJSON();
        expect(json).to.equal('{"foo":1,"bar":2}');
        expect(JSON.parse(json)).to.deep.equal({foo: 1, bar: 2});
        expect(JSON.stringify(obj)).to.equal(JSON.stringify(json), 'JSON.stringify should use toJSON method');
    });

    it('should support observing changes to the internal variable', () => {
        const str = prop('foo');
        const newValue = 'bar';
        const fn = (value) => expect(value).to.equal(newValue);
        const spy = sinon.spy(fn);
        str.observe(spy);
        str.observe(spy);
        str(newValue);
        expect(spy.calledTwice).to.equal(true);
    });
});
