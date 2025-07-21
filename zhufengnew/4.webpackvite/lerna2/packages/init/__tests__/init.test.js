'use strict';

const create = require('..');

describe('@lerna2/init',()=>{
  it('test create',()=>{
    expect(create()).toBe('create')
  })
})
