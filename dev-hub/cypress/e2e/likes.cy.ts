describe('Fluxo de Curtidas (Likes)', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('teste1@email.com');
    cy.get('input[name="password"]').type('123');
    cy.get('button[type="submit"]').click();

    cy.get('article', { timeout: 10000 }).should('be.visible');
    
    cy.intercept('POST', '/api/likes/toggle').as('toggleLike');
    cy.intercept('GET', '/api/likes*').as('getLikes');
  });

  it('deve garantir que o post esteja curtido (Like)', () => {
    cy.wait(2500); // Aumentado para garantir carga total das APIs de likes

    cy.get('article').first().find('button').first().then(($btn) => {
      if (!$btn.hasClass('text-red-400')) {
        cy.wrap($btn).click();
        cy.wait('@toggleLike');
        cy.wait(1000); // Pausa para a UI Otimista estabilizar
      }
      cy.get('article').first().find('button').first().should('have.class', 'text-red-400');
    });
  });

  it('deve garantir que o post esteja descurtido (Unlike)', () => {
    cy.wait(2500); 

    cy.get('article').first().find('button').first().then(($btn) => {
      if ($btn.hasClass('text-red-400')) {
        cy.wrap($btn).click();
        cy.wait('@toggleLike');
        cy.wait(1000); // ESSENCIAL: Espera o componente refletir o estado pós-API
      }
      // Usamos um timeout maior na asserção para dar tempo do React renderizar
      cy.get('article').first().find('button').first()
        .should('not.have.class', 'text-red-400', { timeout: 10000 });
    });
  });

  it('deve persistir o estado após atualizar a página', () => {
    cy.wait(2000);

    // PREPARAÇÃO: Garante que está curtido antes de recarregar
    cy.get('article').first().find('button').first().then(($btn) => {
      if (!$btn.hasClass('text-red-400')) {
        cy.wrap($btn).click();
        cy.wait('@toggleLike');
      }
    });

    cy.reload();
    cy.wait(2000); // Espera o reload e o novo fetch de likes

    cy.get('article').first().find('button').first().should('have.class', 'text-red-400');
  });

// it('deve alternar o estado com cliques consecutivos (Ciclo Completo)', () => {
//     cy.wait(2500);
    
//     // 1. Reset para Descurtido
//     cy.get('article').first().find('button').first().then(($btn) => {
//       if ($btn.hasClass('text-red-400')) {
//         cy.wrap($btn).click();
//         cy.wait('@toggleLike');
//         cy.wait(1000);
//       }
//     });

//     // 2. Ação de Curtir
//     cy.get('article').first().find('button').first().click();
//     cy.wait('@toggleLike');
//     cy.get('article').first().find('button').first().should('have.class', 'text-red-400');

//     cy.wait(1500); // Tempo para o banco processar a inserção antes do delete

//     // 3. Ação de Descurtir
//     cy.get('article').first().find('button').first().click();
//     cy.wait('@toggleLike');
    
//     cy.get('article').first().find('button').first()
//       .should('not.have.class', 'text-red-400', { timeout: 8000 });
//   });
});