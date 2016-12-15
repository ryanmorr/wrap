/* eslint-disable max-len */

import { expect } from 'chai';
import sinon from 'sinon';
import prop from '../src/prop';

describe('prop', () => {
    it('should support reading the internal variable', () => {
        const foo = prop('foo');
        expect(foo.get()).to.equal('foo');
    });

    it('should support setting the internal variable', () => {
        const foo = prop('foo');
        foo.set('bar');
        expect(foo.get()).to.equal('bar');
    });

    it('should support retrieving the type of the internal variable', () => {
        const foo = prop('foo');
        expect(foo.type()).to.equal('string', 'should detect strings');
        foo.set(1);
        expect(foo.type()).to.equal('number', 'should detect numbers');
        foo.set(true);
        expect(foo.type()).to.equal('boolean', 'should detect booleans');
        foo.set([]);
        expect(foo.type()).to.equal('array', 'should detect arrays');
        foo.set({});
        expect(foo.type()).to.equal('object', 'should detect objects');
        foo.set(() => {});
        expect(foo.type()).to.equal('function', 'should detect functions');
        foo.set(/foo/);
        expect(foo.type()).to.equal('regexp', 'should detect regular expressions');
        foo.set(new Date());
        expect(foo.type()).to.equal('date', 'should detect dates');
        foo.set(null);
        expect(foo.type()).to.equal('null', 'should detect null');
        foo.set(void 0);
        expect(foo.type()).to.equal('undefined', 'should detect undefined');
    });

    it('should support comparing the type of the internal variable against a provided type', () => {
        const foo = prop('foo');
        expect(foo.is('string')).to.equal(true, 'should detect strings');
        foo.set(1);
        expect(foo.is('number')).to.equal(true, 'should detect numbers');
        foo.set(true);
        expect(foo.is('boolean')).to.equal(true, 'should detect booleans');
        foo.set([]);
        expect(foo.is('array')).to.equal(true, 'should detect arrays');
        foo.set({});
        expect(foo.is('object')).to.equal(true, 'should detect objects');
        foo.set(() => {});
        expect(foo.is('function')).to.equal(true, 'should detect functions');
        foo.set(/foo/);
        expect(foo.is('regexp')).to.equal(true, 'should detect regular expressions');
        foo.set(new Date());
        expect(foo.is('date')).to.equal(true, 'should detect dates');
        foo.set(null);
        expect(foo.is('null')).to.equal(true, 'should detect null');
        foo.set(void 0);
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
        expect(foo.get()).to.equal(null);
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
        str.set(newValue);
        expect(spy.calledTwice).to.equal(true);
    });

    it('should support encoding the internal variable into a hashcode (integer representation)', () => {
        const example1 = prop({foo: 1, bar: 2});
        const example2 = prop({foo: 1, bar: 2});
        const example3 = prop({foo: 1, bar: 3});
        const code = example2.hashCode();
        expect(example1.hashCode()).to.be.a('number');
        expect(isFinite(code) && code % 1).to.equal(0);
        expect(example1.hashCode()).to.equal(example2.hashCode());
        expect(example1.hashCode()).to.not.equal(example3.hashCode());
    });

    it('should support assertions on the internal variable', () => {
        const foo = prop(10);
        expect(foo.assert((val) => val === 10)).to.equal(true);
        expect(foo.assert((val) => val === 11)).to.equal(false);
    });

    it('should support cloning the internal variable', () => {
        const obj = {foo: 123, bar: {baz: true, qux: 'aaa'}};
        const foo = prop(obj);
        const clone = foo.clone();
        expect(clone === obj).to.equal(false);
        expect(clone).to.deep.equal(obj);
    });

    it('should support logging to the console', () => {
        const msg = 'test';
        const str = 'foo';
        const foo = prop(str);
        const stub = sinon.stub(console, 'log');
        foo.log(msg);
        expect(stub.calledOnce).to.equal(true);
        expect(stub.calledWith(str, msg)).to.equal(true);
        stub.restore();
    });

    it('should support throwing errors', () => {
        const msg = 'error';
        const foo = prop('foo');
        const error = () => {
            foo.error(msg);
        };
        expect(error).to.throw(Error, msg);
    });

    it('should support converting the prop to a string representation of the internal variable', () => {
        const foo = prop('foo');
        expect(foo.toString()).to.equal('foo');
    });

    it('should support primitive coercion', () => {
        const foo = prop(10);
        const code = foo.hashCode();
        expect(foo.valueOf()).to.equal(code);
        expect(Number(foo)).to.equal(code);
        expect(foo + 0).to.equal(code);
    });

    it('should support the iterable protocol if the internal variable is an array', () => {
        let i = 0;
        const array = [1, 2, 3];
        const foo = prop(array);
        expect(Symbol.iterator in foo).to.equal(true);
        for (const value of foo) {
            expect(value).to.equal(array[i++]);
        }
    });

    it('should support the iterable protocol if the internal variable is an object', () => {
        let i = 0;
        const obj = {foo: 1, bar: 2, baz: 3};
        const keys = Object.keys(obj);
        const foo = prop(obj);
        expect(Symbol.iterator in foo).to.equal(true);
        for (const [key, value] of foo) {
            expect(key).to.equal(keys[i]);
            expect(value).to.equal(obj[keys[i++]]);
        }
    });
});
