describe('Página de Perfil', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('teste1@email.com');
    cy.get('input[name="password"]').type('123');
    cy.get('button[type="submit"]').click();

    cy.url({ timeout: 10000 }).should('not.include', '/login');

    cy.visit('/perfil');
  });

  it('deve exibir o avatar com a inicial do nome ou email do usuário', () => {
    cy.get('div.rounded-full')
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        const inicial = text.trim();
        expect(inicial).to.have.length(1);
        expect(inicial).to.match(/[A-Z?]/);
      });
  });

  it('deve exibir o nome do usuário ou "—" como fallback', () => {
    cy.contains('p.font-semibold', /.+/)
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        const nome = text.trim();
        expect(nome.length).to.be.greaterThan(0);
      });
  });

  it('deve exibir o email do usuário ou "—" como fallback', () => {
    cy.get('p.text-zinc-400')
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        const email = text.trim();
        expect(email.length).to.be.greaterThan(0);
      });
  });

  it('deve exibir o botão de sair', () => {
    cy.contains('button', 'Sair')
      .should('be.visible')
      .and('have.class', 'bg-red-600');
  });

//   it('deve redirecionar para /login ao clicar em Sair', () => {
//     cy.intercept('POST', '/api/auth/signout').as('signout');
 
//     cy.contains('button', 'Sair').click();
 
//     cy.wait('@signout');
 
//     cy.url({ timeout: 10000 }).should('include', '/login');
//   });
 
//   it('deve impedir acesso à página de perfil após logout', () => {
//     cy.intercept('POST', '/api/auth/signout').as('signout');
 
//     cy.contains('button', 'Sair').click();
 
//     cy.wait('@signout');
 
//     cy.url({ timeout: 10000 }).should('include', '/login');
 
//     cy.visit('/perfil');
 
//     cy.url().should('include', '/login');
//   });
});