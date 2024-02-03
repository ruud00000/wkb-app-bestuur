import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import AppHeader from '../AppHeader.vue'

describe('AppHeader', () => {
  it('renders properly', () => {
    const wrapper = mount(AppHeader, { props: { msg: 'Prop wordt doorgegeven' } })
    expect(wrapper.text()).toContain('Prop wordt doorgegeven')
  })
})
