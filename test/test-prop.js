/* eslint-disable max-len */

import { expect } from 'chai';
import prop from '../src/prop';

describe('prop', () => {
    it('should support wrapping a variable in the prop utility', () => {
        const foo = prop('foo');
        expect(foo).to.be.a('function');
    });

    it('should support reading the value', () => {
        const foo = prop('foo');
        expect(foo()).to.equal('foo');
    });

    it('should support setting the value', () => {
        const foo = prop('foo');
        expect(foo('bar')).to.equal('bar');
        expect(foo()).to.equal('bar');
    });
});
