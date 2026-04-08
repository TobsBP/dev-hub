import './commands';

Cypress.on('uncaught:exception', (err) => {
  if (
    err.message.includes('removeChild') ||
    err.message.includes('not a child of this node') ||
    err.message.includes('Hydration failed') ||
    err.message.includes('hydration')
  ) {
    return false;
  }
});
