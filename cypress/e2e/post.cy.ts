/// <reference path="../support/commands.ts" />

describe('Validação de Post', () => {
	it('[TC-002] deve bloquear post com menos de 5 caracteres', () => {
		cy.fixture('testUser').then((data) => {
			cy.login(data.user.email, data.user.password);

			cy.get('textarea').type('oi');
			cy.contains('button', 'Postar').click();

			cy.contains('Post deve ter pelo menos 5 caracteres').should('be.visible');
		});
	});
});
