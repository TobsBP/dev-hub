describe('Fluxo de Curtidas (Likes)', () => {
	beforeEach(() => {
		cy.visit('/login');
		cy.get('input[name="email"]').type('teste1@email.com');
		cy.get('input[name="password"]').type('123');
		cy.get('button[type="submit"]').click();

		cy.get('article', { timeout: 10000 }).should('be.visible');

		cy.intercept('POST', '/api/likes/toggle').as('toggleLike');
		cy.intercept('GET', '/api/likes*').as('getLikes');

		cy.wait('@getLikes', { timeout: 10000 });
	});

	it('deve garantir que o post esteja curtido (Like)', () => {
		cy.get('article').first().find('button').first().then(($btn) => {
			if ($btn.hasClass('text-red-400')) {
				cy.wrap($btn).click();
				cy.wait('@toggleLike');
				cy.wait(1000);
			}
		});

		cy.get('article').first().find('button').first().click();
		cy.wait('@toggleLike');
		cy.get('article').first().find('button').first()
			.should('have.class', 'text-red-400', { timeout: 10000 });
	});

	it('deve garantir que o post esteja descurtido (Unlike)', () => {
		cy.get('article').first().find('button').first().then(($btn) => {
			if (!$btn.hasClass('text-red-400')) {
				cy.wrap($btn).click();
				cy.wait('@toggleLike');
				cy.wait(1000);
			}
		});

		cy.get('article').first().find('button').first().click();
		cy.wait('@toggleLike');
		cy.get('article').first().find('button').first()
			.should('not.have.class', 'text-red-400', { timeout: 10000 });
	});

	it('deve persistir o estado após atualizar a página', () => {
		cy.get('article').first().find('button').first().then(($btn) => {
			if (!$btn.hasClass('text-red-400')) {
				cy.wrap($btn).click();
				cy.wait('@toggleLike');
				cy.wait(1000);
			}
		});

		cy.reload();
		cy.intercept('GET', '/api/likes*').as('getLikesReload');
		cy.wait('@getLikesReload', { timeout: 10000 });

		cy.get('article').first().find('button').first()
			.should('have.class', 'text-red-400', { timeout: 10000 });
	});
});
