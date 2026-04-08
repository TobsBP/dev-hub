/// <reference path="../support/commands.ts" />

const API = 'https://dev-hub-api.hubproject.space';

describe('Criação de Post', () => {
	it('[TC-001] deve criar um post e exibi-lo no feed', () => {
		cy.fixture('testUser').then((data) => {
			cy.login(data.user.email, data.user.password);
			cy.get('article', { timeout: 10000 }).should('be.visible');
			cy.wait(1000);

			const content = `Teste automatizado ${Date.now()}`;
			cy.intercept('POST', `${API}/post`).as('createPost');

			cy.get('textarea').type(content);
			cy.contains('button', 'Postar').click();

			cy.wait('@createPost', { timeout: 10000 }).its('response.statusCode').should('eq', 201);
			cy.contains('✓ Post criado com sucesso!').should('be.visible');
			cy.contains(content, { timeout: 10000 }).should('be.visible');
		});
	});

	it('[TC-002] deve bloquear post com menos de 5 caracteres', () => {
		cy.fixture('testUser').then((data) => {
			cy.login(data.user.email, data.user.password);
			cy.get('article', { timeout: 10000 }).should('be.visible');

			cy.intercept('POST', `${API}/post`).as('createPost');

			cy.get('textarea').type('oi');
			cy.contains('button', 'Postar').click();

			cy.contains('Post deve ter pelo menos 5 caracteres').should('be.visible');
			cy.get('@createPost.all').should('have.length', 0);
		});
	});

	it('[TC-003] deve exibir o post com o tipo correto', () => {
		cy.fixture('testUser').then((data) => {
			cy.login(data.user.email, data.user.password);
			cy.get('article', { timeout: 10000 }).should('be.visible');

			const content = `Post tipo pergunta ${Date.now()}`;
			cy.intercept('POST', `${API}/post`).as('createPost');

			cy.get('textarea').type(content);
			cy.get('select').select('question');
			cy.contains('button', 'Postar').click();

			cy.wait('@createPost', { timeout: 10000 }).its('response.statusCode').should('eq', 201);
			cy.contains(content, { timeout: 10000 })
				.closest('article')
				.contains('pergunta')
				.should('be.visible');
		});
	});
});
