/// <reference types="cypress" />

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): void;
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('input[name="email"]', { timeout: 10000 }).should('be.visible').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url({ timeout: 20000 }).should('not.include', '/login');
  cy.get('article', { timeout: 15000 }).should('be.visible');
});
