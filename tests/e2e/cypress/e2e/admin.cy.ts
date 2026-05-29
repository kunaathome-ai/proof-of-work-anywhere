describe('Admin Console E2E Tests', () => {
  const adminUrl = Cypress.env('ADMIN_URL') || 'http://localhost:3000';

  beforeEach(() => {
    cy.visit(adminUrl);
  });

  describe('Dashboard', () => {
    it('should display dashboard with stats', () => {
      cy.contains('Dashboard').should('be.visible');
      cy.contains('Total Jobs').should('be.visible');
      cy.contains('Active Jobs').should('be.visible');
      cy.contains('Total Clients').should('be.visible');
    });
  });

  describe('Jobs Management', () => {
    it('should navigate to jobs page', () => {
      cy.contains('Jobs').click();
      cy.url().should('include', '/jobs');
      cy.contains('Create Job').should('be.visible');
    });

    it('should display jobs table', () => {
      cy.contains('Jobs').click();
      cy.get('table').should('be.visible');
      cy.contains('Job').should('be.visible');
      cy.contains('Client').should('be.visible');
      cy.contains('Status').should('be.visible');
    });
  });

  describe('Clients Management', () => {
    it('should navigate to clients page', () => {
      cy.contains('Clients').click();
      cy.url().should('include', '/clients');
      cy.contains('Add Client').should('be.visible');
    });

    it('should display client cards', () => {
      cy.contains('Clients').click();
      cy.get('.bg-white').should('have.length.greaterThan', 0);
    });
  });

  describe('Storage Configuration', () => {
    it('should navigate to storage page', () => {
      cy.contains('Storage').click();
      cy.url().should('include', '/storage');
      cy.contains('Add Storage').should('be.visible');
    });

    it('should display storage configurations', () => {
      cy.contains('Storage').click();
      cy.contains('Local Storage').should('be.visible');
    });
  });

  describe('AI Configuration', () => {
    it('should navigate to AI page', () => {
      cy.contains('AI Models').click();
      cy.url().should('include', '/ai');
      cy.contains('Add Model').should('be.visible');
    });

    it('should display AI models', () => {
      cy.contains('AI Models').click();
      cy.contains('GPT-4o').should('be.visible');
    });
  });

  describe('Settings', () => {
    it('should navigate to settings page', () => {
      cy.contains('Settings').click();
      cy.url().should('include', '/settings');
    });

    it('should display runtime mode selector', () => {
      cy.contains('Settings').click();
      cy.contains('Runtime Mode').should('be.visible');
      cy.get('select').should('be.visible');
    });
  });

  describe('Mobile Responsiveness', () => {
    it('should be responsive on mobile viewport', () => {
      cy.viewport('iphone-x');
      cy.contains('Dashboard').should('be.visible');
    });

    it('should be responsive on tablet viewport', () => {
      cy.viewport('ipad-2');
      cy.contains('Dashboard').should('be.visible');
    });
  });
});
