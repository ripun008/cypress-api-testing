/// <reference types="cypress" />

describe('Cypress API tests', () => {

  beforeEach('login to Application', () => {
    cy.loginToApplication()
  }) 

  it('login via backend', () => {
    cy.log('logged in to the app!')
  })
})