import {mount} from '@vue/test-utils'
import TodoApp from './TodoApp.vue'

test('render TodoApp',()=>{
  const wrapper=mount(TodoApp)
  const addTodo=wrapper.get('[data-test="addTodo"]')
  expect(addTodo.text()).toBe('Add') // 假设按钮文本是 Add

})