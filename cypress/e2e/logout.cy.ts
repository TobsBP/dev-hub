describe('Página de Perfil', () => {
	beforeEach(() => {
		cy.visit('/login');
		cy.get('input[name="email"]').type('teste1@email.com');
		cy.get('input[name="password"]').type('123');
		cy.get('button[type="submit"]').click();

		cy.url({ timeout: 10000 }).should('not.include', '/login');

		cy.visit('/perfil');
	});

	it('Lg-001 deve exibir o avatar com a inicial do nome ou email do usuário', () => {
		cy.get('div.w-20.h-20.rounded-full', { timeout: 10000 })
			.should('be.visible')
			.invoke('text')
			.then((text) => {
				const inicial = text.trim();
				expect(inicial.length).to.be.greaterThan(0);
				expect(inicial[0]).to.match(/[A-Z?]/);
			});
	});

	it('Lg-002 deve exibir o nome do usuário ou "—" como fallback', () => {
		cy.contains('p.font-semibold', /.+/)
			.should('be.visible')
			.invoke('text')
			.then((text) => {
				const nome = text.trim();
				expect(nome.length).to.be.greaterThan(0);
			});
	});

	it('Lg-003 deve exibir o email do usuário ou "—" como fallback', () => {
		cy.get('p.text-zinc-400')
			.should('be.visible')
			.invoke('text')
			.then((text) => {
				const email = text.trim();
				expect(email.length).to.be.greaterThan(0);
			});
	});

	it('Lg-004 deve exibir o botão de sair', () => {
		cy.contains('button', 'Sair')
			.should('be.visible')
			.and('have.class', 'bg-red-600');
	});
});
