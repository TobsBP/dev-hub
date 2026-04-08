describe('Componente PostCard', () => {
  const setup = () => {
    cy.session('postcard-user', () => {
      cy.visit('/login');
      cy.get('input[name="email"]').type('teste1@email.com');
      cy.get('input[name="password"]').type('123');
      cy.get('button[type="submit"]').click();
      cy.url({ timeout: 10000 }).should('not.include', '/login');
    });
    cy.visit('/');
    cy.get('article', { timeout: 10000 }).should('be.visible');
  };

  // --- Renderização do card ---

  it('PC-001 deve exibir o avatar com inicial ou imagem do autor', () => {
    setup();
    cy.get('article').first().within(() => {
      cy.get('div.w-9.h-9.rounded-full')
        .should('be.visible')
        .then(($el) => {
          const hasImage = $el.find('img').length > 0;
          const hasText = $el.text().trim().length > 0;
          expect(hasImage || hasText).to.be.true;
        });
    });
  });

  it('PC-002 deve exibir o nome ou email do autor', () => {
    setup();
    cy.get('article').first().within(() => {
      cy.get('p.text-sm.font-medium.text-white')
        .should('be.visible')
        .invoke('text')
        .then((text) => {
          expect(text.trim().length).to.be.greaterThan(0);
        });
    });
  });

  it('PC-003 deve exibir a data de criação do post', () => {
    setup();
    cy.get('article').first().within(() => {
      cy.get('p.text-xs.text-zinc-500')
        .should('be.visible')
        .invoke('text')
        .then((text) => {
          expect(text.trim().length).to.be.greaterThan(0);
        });
    });
  });

  it('PC-004 deve exibir o badge com o tipo do post', () => {
    setup();
    cy.get('article').first().within(() => {
      cy.get('span.rounded-full.text-zinc-400')
        .should('be.visible')
        .invoke('text')
        .then((text) => {
          expect(text.trim().length).to.be.greaterThan(0);
        });
    });
  });

  it('PC-005 deve exibir o conteúdo do post', () => {
    setup();
    cy.get('article').first().find('div.px-4.py-4')
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        expect(text.trim().length).to.be.greaterThan(0);
      });
  });

  // --- Curtidas ---

  it('PC-006 deve exibir o botão de curtir com contador', () => {
    setup();
    cy.get('article').first().within(() => {
      cy.get('button').contains(/^\d+$/).should('exist');
    });
  });

  // --- Comentários ---

  it('PC-007 deve exibir o botão de comentários com contador', () => {
    setup();
    cy.get('article').first().within(() => {
      cy.contains('button', /comentário/).should('be.visible');
    });
  });

  it('PC-008 deve abrir a área de comentários ao clicar no botão', () => {
    setup();
    cy.get('article').first().within(() => {
      cy.contains('button', /comentário/).click();
      cy.get('input[placeholder*="Comentar"]').should('be.visible');
    });
  });

  it('PC-009 deve fechar a área de comentários ao clicar novamente no botão', () => {
    setup();
    cy.get('article').first().within(() => {
      cy.contains('button', /comentário/).click();
      cy.get('input[placeholder*="Comentar"]').should('be.visible');
      cy.contains('button', /comentário/).click();
      cy.get('input[placeholder*="Comentar"]').should('not.exist');
    });
  });

  it('PC-010 deve manter o botão publicar desabilitado com texto menor que 2 caracteres', () => {
    setup();
    cy.get('article').first().within(() => {
      cy.contains('button', /comentário/).click();
      cy.get('input[placeholder*="Comentar"]').type('a');
      cy.contains('button', 'Publicar').should('be.disabled');
    });
  });

  it('PC-011 deve habilitar o botão publicar com texto de 2 ou mais caracteres', () => {
    setup();
    cy.get('article').first().within(() => {
      cy.contains('button', /comentário/).click();
      cy.get('input[placeholder*="Comentar"]').type('ok');
      cy.contains('button', 'Publicar').should('not.be.disabled');
    });
  });

  // --- Tipos de post ---

  it('PC-012 deve renderizar post do tipo "code" com syntax highlighter', () => {
    setup();
    cy.get('article').contains('span.rounded-full', /[Cc]ódigo|code/i)
      .closest('article')
      .find('pre')
      .should('exist');
  });

  it('PC-013 deve renderizar post do tipo "question" com destaque visual', () => {
    setup();
    cy.get('article').contains('span.rounded-full', /[Pp]ergunta|question/i)
      .closest('article')
      .find('div.bg-amber-950\\/30')
      .should('exist');
  });
});
