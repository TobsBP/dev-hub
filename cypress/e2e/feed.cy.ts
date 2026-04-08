const LOGIN_EMAIL = 'teste1@email.com';
const LOGIN_PASSWORD = '123';

describe('Feed Page', () => {
  const login = () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type(LOGIN_EMAIL);
    cy.get('input[name="password"]').type(LOGIN_PASSWORD);
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10_000 }).should('not.include', '/login');
  };

  const visitFeed = () => cy.visit('http://localhost:3000');

  const mockPostsLoading = () => {
    cy.intercept('GET', '**/posts*', (req) => {
      req.reply({ delay: 3000, statusCode: 200, body: [] });
    }).as('getPostsLoading');
  };

  const mockPostsError = () => {
    cy.intercept('GET', '**/posts*', { statusCode: 500, body: { message: 'Erro interno' } }).as('getPostsError');
  };

  const mockPosts = (posts: object[]) => {
    cy.intercept('GET', '**/posts*', { statusCode: 200, body: posts }).as('getPosts');
  };

  beforeEach(() => {
    login();
  });

  describe('Renderização básica', () => {
    it('F-001deve exibir o título "Feed"', () => {
      mockPosts([]);
      visitFeed();
      cy.contains('h1', 'Feed').should('be.visible');
    });

    it('F-002 deve exibir o formulário de criação de post', () => {
      mockPosts([]);
      visitFeed();
      cy.get('form, [data-testid="create-post-form"]').should('exist');
    });
  });

  describe('Estado de carregamento (loading)', () => {
    it('F-003 deve exibir skeletons enquanto os posts carregam', () => {
      mockPostsLoading();
      visitFeed();
      cy.get('.animate-pulse').should('have.length.at.least', 1);
    });

    it('F-004 não deve exibir mensagem de vazio durante o carregamento', () => {
      mockPostsLoading();
      visitFeed();
      cy.contains('Nenhum post ainda').should('not.exist');
    });
  });

  describe('Estado de erro', () => {
    it('F-005 deve exibir mensagem de erro quando a API falha', () => {
      mockPostsError();
      visitFeed();
      cy.wait('@getPostsError');
      cy.get('[class*="red"]').should('be.visible');
    });

    it('F-006 deve exibir o botão "tentar novamente"', () => {
      mockPostsError();
      visitFeed();
      cy.wait('@getPostsError');
      cy.contains('tentar novamente').should('be.visible');
    });
  });
});