describe('Login', () => {
	beforeEach(() => {
		cy.visit('/login');
	});

	it('[TC-004] deve bloquear submit com email sem @', () => {
		cy.get('input[name="email"]').type('emailsemarroba');
		cy.get('input[name="password"]').type('qualquersenha');
		cy.get('button[type="submit"]').click();

		cy.get('input[name="email"]:invalid').should('exist');
		cy.url().should('include', '/login');
	});

	it('[TC-005] deve exibir erro com senha incorreta', () => {
		cy.get('input[name="email"]').type('teste1@email.com');
		cy.get('input[name="password"]').type('senhaerrada123');
		cy.get('button[type="submit"]').click();

		cy.contains('Email ou senha inválidos.', { timeout: 10000 }).should('be.visible');
		cy.url().should('include', '/login');
	});

	it('[TC-006] deve exibir erro com email não cadastrado', () => {
		cy.get('input[name="email"]').type('naoexiste@email.com');
		cy.get('input[name="password"]').type('qualquersenha');
		cy.get('button[type="submit"]').click();

		cy.contains('Email ou senha inválidos.', { timeout: 10000 }).should('be.visible');
		cy.url().should('include', '/login');
	});
});
