'use strict';

const create = require('..');

describe('@lerna2/add',()=>{
  it('test create',()=>{
    expect(create()).toBe('create')
  })
})
