// Import necessary Vitest functions
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

// Import the components to be tested
import Uitslagen from '../Uitslagen.vue'
import Item from '../Item.vue'

  describe('Uitslagen.vue', () => {
    it('renders 1 Item component', async () => {
      // Create Vite app instance
      const app = await mount(Uitslagen)
  
      // Access the rendered component
      const component = app.getComponent(Uitslagen)
  
      // Check if there are four links in the component
      expect(component.findAllComponents(Item)).toHaveLength(1);     

    })

    it('renders hrefs correctly', async () => {
        // Create Vite app instance
        const app = await mount(Uitslagen)
    
        // Access the rendered component
        const component = app.getComponent(Uitslagen)
    
        // Check if there are 15 links in the component
        expect(component.findAll('a')).toHaveLength(1);

        // Further assertions for each link's href
        const links = component.findAll('a')
          
        // Assuming pdfPath is a prop passed to Uitslagen component
        expect(links[0].attributes('href')).toContain('#')
        expect(links[0].text()).toBe('upload Excel-bestand')   
      })

  })

