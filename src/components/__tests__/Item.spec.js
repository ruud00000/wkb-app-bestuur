// Item.spec.js
import { describe, it, mount, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'

// Import your Vue component
import Item from '../Item.vue';

// Test suite for the Item component
describe('Item Component', () => {
   
  let wrapper;

  // Set up before each test
  beforeEach(() => {
    // Mount the component
    wrapper = mount(Item);
  });

  // Test case to check if the component renders correctly
  it('should render correctly', () => {
    // Assert that the component is rendered
    expect(wrapper.exists()).toBe(true);
  });

  // Test case to check if the slot content is rendered
  it('should render slot content', () => {
    // Mount the component with slot content
    wrapper = mount(Item, {
      slots: {
        default: 'Slot Content',
      },
    });

    // Assert that the slot content is rendered
    expect(wrapper.text()).toContain('Slot Content');
  });

  // Clean up after each test
  afterEach(() => {
    wrapper = null;
  });
});
