// Cypress support file for E2E tests

// Global beforeEach hook
beforeEach(() => {
  // Reset application state before each test
  cy.clearCookies();
  cy.clearLocalStorage();
});

// Global afterEach hook
afterEach(() => {
  // Clean up after each test
});

// Custom commands
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.get('[name="username"]').type(username);
  cy.get('[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('waitForApi', (url: string) => {
  cy.intercept('GET', url).as('apiRequest');
  cy.wait('@apiRequest');
});

// Uncaught exception handler
Cypress.on('uncaught:exception', (err, runnable) => {
  // Return false to prevent Cypress from failing the test
  if (err.message.includes('ResizeObserver')) {
    return false;
  }
  return true;
});
