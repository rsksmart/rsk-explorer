import { expect } from 'chai'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Message from '@/components/Message.vue'
import store from '@/store'
const localVue = createLocalVue()
localVue.use(Vuex)
// let state = { messages: {} }
// const store = new Vuex.Store({ state })

describe('Message.vue', () => {
  it('renders props.message when passed', () => {
    const message = { txt: 'test messsage' }
    const wrapper = shallowMount(Message, {
      store,
      localVue,
      propsData: { message }
    })
    expect(wrapper.find('small').text()).to.include(message.txt)
  })
})
