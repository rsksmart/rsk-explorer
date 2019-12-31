import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import FieldTitle from '@/components/FieldTitle.vue'

const fieldDescriptionSelector = '.field-description'

describe('FieldTitle.vue', () => {
  let field = {
    name: 'test field',
    description: 'test field description'
  }
  it('render field title with description', () => {
    let wrapper = shallowMount(FieldTitle, { propsData: { field } })
    expect(wrapper.contains(fieldDescriptionSelector)).equal(true)
  })

  it('render field title without description', () => {
    let field = {
      description: 'test',
      hideDescription: true
    }
    let wrapper = shallowMount(FieldTitle, { propsData: { field } })
    expect(wrapper.contains(fieldDescriptionSelector)).equal(false)
  })
  it('render field title without description', () => {
    let field = {
      description: '',
      hideDescription: false
    }
    let wrapper = shallowMount(FieldTitle, { propsData: { field } })
    expect(wrapper.contains(fieldDescriptionSelector)).equal(false)
  })
})
