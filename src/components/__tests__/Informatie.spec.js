import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Informatie from '../Informatie.vue'
import packageJson from '../../../package.json'
import WKBIcon from '../icons/IconWKB.vue'
import DevIcon from '../icons/IconDev.vue'

describe('Informatie.vue', () => {
  it('renders the WKB icon and heading', async () => {
    const wrapper = mount(Informatie)

    // Check if the WKB icon is rendered
    expect(wrapper.findComponent(WKBIcon).exists()).toBe(true)

    // Check if the heading is rendered with the correct text
    expect(wrapper.text()).toContain('Over de WKB')
  })

  it('renders the Dev icon and heading', async () => {
    const wrapper = mount(Informatie)

    // Check if the Dev icon is rendered
    expect(wrapper.findComponent(DevIcon).exists()).toBe(true)

    // Check if the heading is rendered with the correct text
    expect(wrapper.text()).toContain('Over de site')
  })

  it('renders the producteisen link with the correct href', async () => {
    const wrapper = mount(Informatie)

    // Check if the producteisen link is rendered with the correct href
    expect(wrapper.find('a').attributes('href')).toBe('/src/assets/producteisen.pdf')
  })

  it('renders the correct version', async () => {
    const wrapper = mount(Informatie)

    // Check if the version is rendered with the correct text
    expect(wrapper.text()).toContain(`Dit is versie ${packageJson.version}`)
  })
})
