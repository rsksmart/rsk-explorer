import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import FieldTitle from '@/components/FieldTitle.vue'

const fieldDescriptionSelector = '.field-description'

describe('FieldTitle.vue', () => {
  const field = {
    name: 'test field',
    description: 'test field description'
  }
  it('render field title with description', () => {
    const wrapper = shallowMount(FieldTitle, { propsData: { field } })
    expect(wrapper.contains(fieldDescriptionSelector)).equal(true)
  })

  it('render field title without description', () => {
    const field = {
      description: 'test',
      hideDescription: true
    }
    const wrapper = shallowMount(FieldTitle, { propsData: { field } })
    expect(wrapper.contains(fieldDescriptionSelector)).equal(false)
  })
  it('render field title without description', () => {
    const field = {
      description: '',
      hideDescription: false
    }
    const wrapper = shallowMount(FieldTitle, { propsData: { field } })
    expect(wrapper.contains(fieldDescriptionSelector)).equal(false)
  })
})
