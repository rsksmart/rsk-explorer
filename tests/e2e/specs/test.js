// https://docs.cypress.io/api/introduction/api.html

describe('My First Test', () => {
  it('Visits the app root url', () => {
    cy.visit('/')
    cy.contains('h1', 'rsk explorer')
  })
})

describe('Transaction Confirmation', () => {
  it('Checks transactions\' confirmation field', () => {
    cy.visit('/txs')

    for (let i = 0; i < 20; i++) {
      const link = cy.get('.row-icon > a', { timeout: 40000 }).eq(i)
      link.should('have.attr', 'href').then(href => {
        cy.visit(href)
        cy.get('.field-value').eq(2).contains('confirmation')
        cy.visit('/txs?page__data=' + i + 5)
      })
    }
  })
})
