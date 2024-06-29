// Import necessary Vitest functions
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

// Import the components to be tested
import Upload from '../Upload.vue'
import Item from '../Item.vue'

  describe('Upload Component', () => {
    it('renders 2 Item components', async () => {
      // Create Vite app instance
      const app = mount(Upload)
  
      // Access the rendered component
      const component = app.getComponent(Upload)
  
      // Check if there are four links in the component
      expect(component.findAllComponents(Item)).toHaveLength(2);     

    })

    it('renders 1 RouterLink component', async () => {
      // Mock the RouterLink component
      const RouterLinkStub = {
        template: '<a><slot /></a>',
      }

      // Create Vite app instance with RouterLink stubbed
      // uitleg zie https://chatgpt.com/share/72c9fbb3-cfe0-49de-a935-c76f9e0bbb85
      const app = mount(Upload, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })
  
      // Access the rendered component
      const component = app.getComponent(Upload)
  
      // Check if there are four links in the component
      expect(component.findAllComponents(RouterLinkStub)).toHaveLength(1);    
      
      const routerLinks = component.findAllComponents(RouterLinkStub)

      expect(routerLinks[0].attributes('to')).toContain('/nieuws')
      expect(routerLinks[0].text()).toBe('nieuws publiceren')
    })

    it('renders hrefs correctly', async () => {
        // Create Vite app instance
        const app = mount(Upload)
    
        // Access the rendered component
        const component = app.getComponent(Upload)
    
        // Check if there is 1 link in the component
        expect(component.findAll('a')).toHaveLength(1);

        // Further assertions for each link's href
        const links = component.findAll('a')
          
        // Assuming pdfPath is a prop passed to Upload component
        expect(links[0].attributes('href')).toContain('#')
        expect(links[0].text()).toBe('upload Excel-bestand')
      })

  })

