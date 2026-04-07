describe('Feed Page', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('teste1@email.com');
    cy.get('input[name="password"]').type('123');
    cy.get('button[type="submit"]').click();

    cy.url({ timeout: 10000 }).should('not.include', '/login');

  });

  it('should display the main title', () => {
    cy.visit('http://localhost:3000'); 
    cy.contains('DevHub').should('be.visible');
  });
});