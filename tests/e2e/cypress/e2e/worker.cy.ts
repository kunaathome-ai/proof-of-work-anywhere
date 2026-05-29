describe('Worker UI E2E Tests', () => {
  const workerUrl = Cypress.env('WORKER_URL') || 'http://localhost:3010';

  describe('Magic Link Flow', () => {
    it('should validate magic link', () => {
      const token = 'test-token-123';
      cy.visit(`${workerUrl}/?token=${token}`);
      
      cy.contains('Validating Magic Link').should('be.visible');
      
      // Wait for validation to complete
      cy.contains('Access Verified', { timeout: 10000 }).should('be.visible');
    });

    it('should show error for invalid token', () => {
      cy.visit(`${workerUrl}/?token=invalid`);
      
      cy.contains('Invalid Link', { timeout: 10000 }).should('be.visible');
    });
  });

  describe('Job Details', () => {
    beforeEach(() => {
      cy.visit(`${workerUrl}/job/123`);
    });

    it('should display job information', () => {
      cy.contains('Site Inspection').should('be.visible');
      cy.contains('Location').should('be.visible');
      cy.contains('Photos Required').should('be.visible');
    });

    it('should display checklist items', () => {
      cy.contains('Checklist Items').should('be.visible');
      cy.get('ul').should('be.visible');
    });

    it('should start evidence capture', () => {
      cy.contains('Start Evidence Capture').click();
      cy.url().should('include', '/evidence');
    });
  });

  describe('Evidence Capture', () => {
    beforeEach(() => {
      cy.visit(`${workerUrl}/evidence/123`);
    });

    it('should display photo capture interface', () => {
      cy.contains('Photos').should('be.visible');
      cy.contains('0/5 required').should('be.visible');
    });

    it('should display location capture', () => {
      cy.contains('Location').should('be.visible');
      cy.contains('Capture GPS location').should('be.visible');
    });

    it('should capture GPS location', () => {
      cy.contains('Capture GPS location').click();
      // Mock geolocation
      cy.window().then((win) => {
        cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((success) => {
          success({
            coords: {
              latitude: 40.7128,
              longitude: -74.0060,
              accuracy: 10
            }
          });
        });
      });
    });
  });

  describe('Checklist', () => {
    beforeEach(() => {
      cy.visit(`${workerUrl}/checklist/123`);
    });

    it('should display checklist items', () => {
      cy.contains('Checklist').should('be.visible');
      cy.get('input[type="checkbox"]').should('have.length.greaterThan', 0);
    });

    it('should allow toggling checklist items', () => {
      cy.get('input[type="checkbox"]').first().click();
      cy.get('input[type="checkbox"]').first().should('be.checked');
    });

    it('should show progress', () => {
      cy.contains('0/5').should('be.visible');
      cy.get('input[type="checkbox"]').first().click();
      cy.contains('1/5').should('be.visible');
    });
  });

  describe('Summary', () => {
    beforeEach(() => {
      cy.visit(`${workerUrl}/summary/abc123`);
    });

    it('should display evidence summary', () => {
      cy.contains('Review & Submit').should('be.visible');
      cy.contains('Evidence Summary').should('be.visible');
    });

    it('should submit evidence', () => {
      cy.contains('Submit Evidence').click();
      cy.contains('Uploading evidence').should('be.visible');
    });

    it('should show success message after submission', () => {
      cy.contains('Submit Evidence').click();
      cy.contains('Evidence Submitted!', { timeout: 15000 }).should('be.visible');
    });
  });

  describe('Offline Mode', () => {
    it('should show offline banner when offline', () => {
      cy.visit(`${workerUrl}/job/123`);
      cy.window().then((win) => {
        win.dispatchEvent(new Event('offline'));
      });
      cy.contains("You're offline").should('be.visible');
    });

    it('should hide offline banner when online', () => {
      cy.visit(`${workerUrl}/job/123`);
      cy.window().then((win) => {
        win.dispatchEvent(new Event('offline'));
        win.dispatchEvent(new Event('online'));
      });
      cy.contains("You're offline").should('not.exist');
    });
  });

  describe('Mobile Responsiveness', () => {
    it('should work on mobile viewport', () => {
      cy.viewport('iphone-x');
      cy.visit(`${workerUrl}/job/123`);
      cy.contains('Site Inspection').should('be.visible');
    });

    it('should work on tablet viewport', () => {
      cy.viewport('ipad-2');
      cy.visit(`${workerUrl}/job/123`);
      cy.contains('Site Inspection').should('be.visible');
    });
  });

  describe('Touch Interactions', () => {
    it('should have touch-friendly buttons', () => {
      cy.visit(`${workerUrl}/evidence/123`);
      cy.get('button').should('have.css', 'min-height').and('match', /\d+px/);
    });
  });
});
