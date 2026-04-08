describe('Registro', () => {
	beforeEach(() => {
		cy.visit('/register');
	});

	it('[TC-007] deve bloquear submit com campos vazios', () => {
		cy.get('button[type="submit"]').click();
		cy.get('input[name="username"]:invalid').should('exist');
		cy.url().should('include', '/register');
	});

	it('[TC-008] deve exibir erro ao tentar registrar email já cadastrado', () => {
		cy.get('input[name="username"]').type('usuarioteste');
		cy.get('input[name="email"]').type('teste1@email.com');
		cy.get('input[name="password"]').type('123');
		cy.get('button[type="submit"]').click();

		cy.get('p.text-red-500', { timeout: 10000 }).should('be.visible');
		cy.url().should('include', '/register');
	});


	it('[TC-010] deve rejeitar upload de arquivo não imagem', () => {
		cy.get('#register-avatar').invoke('attr', 'accept').should('eq', 'image/*');

		cy.get('#register-avatar').selectFile(
			{ contents: Cypress.Buffer.from('fake-pdf'), fileName: 'documento.pdf', mimeType: 'application/pdf' },
			{ force: true }
		);
-
		cy.contains('documento.pdf').should('not.exist');
	});
});
