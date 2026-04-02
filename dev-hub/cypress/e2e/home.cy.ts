describe('Home Page', () => {
  it('should display the main title', () => {
    cy.visit('http://localhost:3000'); // Assuming your Next.js app runs on port 3000
    cy.contains('DevHub').should('be.visible');
  });
});