'use strict';

const create = require('..');

describe('@lerna2/lerna2',()=>{
  it('test create',()=>{
    expect(create()).toBe('create')
  })
})
