describe('Criação de Post', () => {
	beforeEach(() => {
		cy.visit('/login');
		cy.get('input[name="email"]').type('teste1@email.com');
		cy.get('input[name="password"]').type('123');
		cy.get('button[type="submit"]').click();

		cy.get('article', { timeout: 10000 }).should('be.visible');
	});

	it('deve criar um post e exibi-lo no feed', () => {
		const content = `Teste automatizado ${Date.now()}`;

		cy.intercept('POST', '/api/posts').as('createPost');

		cy.get('textarea').type(content);
		cy.get('button[type="submit"]').click();

		cy.wait('@createPost').its('response.statusCode').should('eq', 201);

		cy.contains(content, { timeout: 10000 }).should('be.visible');
	});

	it('deve bloquear post com menos de 5 caracteres', () => {
		cy.intercept('POST', '/api/posts').as('createPost');

		cy.get('textarea').type('oi');
		cy.get('button[type="submit"]').click();

		cy.contains('Post deve ter pelo menos 5 caracteres').should('be.visible');
		cy.get('@createPost.all').should('have.length', 0);
	});

	it('deve exibir o post com o tipo correto', () => {
		const content = `Post tipo pergunta ${Date.now()}`;

		cy.intercept('POST', '/api/posts').as('createPost');

		cy.get('textarea').type(content);
		cy.get('select').select('question');
		cy.get('button[type="submit"]').click();

		cy.wait('@createPost').its('response.statusCode').should('eq', 201);

		cy.contains(content, { timeout: 10000 })
			.closest('article')
			.contains('pergunta')
			.should('be.visible');
	});
});
