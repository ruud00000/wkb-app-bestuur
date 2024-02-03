// https://on.cypress.io/api

describe('WKB App Test', () => {
  it('opent app root url', () => {
    cy.visit('/')
    cy.contains('h1', 'Kegelen in Winterswijk')
    cy.contains('h3', 'Welkom op de website van de Winterswijkse Kegelbond!')
  }),
  it('toont versie op pagina informatie', () => {
    cy.visit('/informatie')
    cy.contains('Dit is versie')
  }),
  it('toont competitie 2023 op pagina uitslagen', () => {
    cy.visit('/')
    cy.contains('competitie van 2023')
  }),
  it('link competitie 2023 bestaat', () => {
    cy.visit('/')
    cy.contains('competitie van 2023').should('have.attr', 'target', '_blank')

  })
})
