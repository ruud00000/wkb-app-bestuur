import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:4173', 
    setupNodeEvents(on, config) {
      const environment = config.env.environment || 'dev'
      config.env = { ...config.env, ...config.env[environment] }
      return config
    }
  },
  env: {
    dev: {
      hrefProducteisen: '/src/assets/producteisen.pdf'
    },
    prod: {
      hrefProducteisen: '/assets/producteisen-C5odOMfO.pdf'
    }
  }  
})
