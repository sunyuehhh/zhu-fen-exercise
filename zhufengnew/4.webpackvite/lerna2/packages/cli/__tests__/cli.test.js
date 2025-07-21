'use strict';

const create = require('..');

describe('@lerna2/cli',()=>{
  it('test create',()=>{
    expect(create()).toBe('create')
  })
})
