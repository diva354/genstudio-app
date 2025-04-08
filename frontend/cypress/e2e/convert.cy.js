describe('Roman Numeral Converter', () => {
    const frontend_URL = 'http://localhost:3000';
    
    it('converts 10 to X', () => {
        cy.visit(frontend_URL);
      cy.get('input[type="number"]').type('10');
      cy.contains('Convert').click();
  
      cy.contains('Roman numeral: X').should('be.visible');
    });

    it('converts 101 to CI', () => {
        cy.visit(frontend_URL);
        cy.get('input[type="number"]').type('101');
        cy.contains('Convert').click();
    
        cy.contains('Roman numeral: CI').should('be.visible');
      });

    it('shows correct message when clicked without input', () => {
        cy.visit(frontend_URL);
        cy.contains('Convert').click();
        cy.get('[aria-invalid="true"]').should('exist');
        cy.contains('Input Invalid. Please enter a valid whole number between 1 and 3999.').should('be.visible');
      });
  
    it('shows error for out of range input', () => {
      cy.visit(frontend_URL);
      cy.get('input[type="number"]').type('4000');
      cy.contains('Convert').click();
  
      cy.contains('Input Invalid. Please enter a valid whole number between 1 and 3999.').should('be.visible');
    });

    it('handles backend 500 error gracefully', () => {
        cy.intercept('GET', '**/romannumeral*', {
          statusCode: 500,
          body: {
            errorMessage: 'Internal server error.',
            statusCode: 500
          }
        }).as('failAPI');
      
        cy.visit('http://localhost:3000');
        cy.get('input[type="number"]').type('3999'); // Just to bypass the frontend validation and make API throw error
        cy.contains('Convert').click();
      
        cy.wait('@failAPI');
      
        cy.contains('Internal server error.').should('be.visible');
      });
    
      it('shows error if user is offline', () => {
        cy.visit(frontend_URL);
          cy.window().then((win) => {
              cy.stub(win.navigator, 'onLine').value(false);
          });

          cy.intercept('GET', '**/romannumeral?query=20', {
              forceNetworkError: true,
          });
    
        cy.get('input[type="number"]').type('20');
        cy.contains('Convert').click();
        cy.contains(/You appear to be offline/i).should('be.visible');
      });

      it('submits form with Enter key', () => {
        cy.visit(frontend_URL);
        cy.get('input[type="number"]').type('11{enter}');
        cy.contains('Roman numeral: XI').should('be.visible');
      });

      it('handle timeout errors', () => {
        cy.intercept('GET', '**/romannumeral?query=20', (req) => req.reply(res => res.setDelay(12000))).as('delayedAPI');
        cy.visit(frontend_URL);
        cy.get('input[type="number"]').type('20{enter}');
        cy.get('button').should('be.disabled');

        cy.wait('@delayedAPI');
        cy.contains(/Request timed out/i).should('be.visible');
      });
      
  });
  