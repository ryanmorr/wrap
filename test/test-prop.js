/* eslint-disable max-len */

import { expect } from 'chai';
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
});
