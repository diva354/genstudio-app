describe('Roman Numeral Converter', () => {
    it('converts 10 to X', () => {
      cy.visit('http://localhost:3000');
  
      cy.get('input[type="number"]').type('10');
      cy.contains('Convert').click();
  
      cy.contains('Roman numeral: X').should('be.visible');
    });

    it('converts 101 to CI', () => {
        cy.visit('http://localhost:3000');
    
        cy.get('input[type="number"]').type('101');
        cy.contains('Convert').click();
    
        cy.contains('Roman numeral: CI').should('be.visible');
      });

    it('shows correct message when clicked without input', () => {
        cy.visit('http://localhost:3000');
    
        cy.contains('Convert').click();
        cy.contains('Input Invalid. Please enter a valid whole number between 1 and 3999.').should('be.visible');
      });
  
    it('shows error for invalid input', () => {
      cy.visit('http://localhost:3000');
  
      cy.get('input[type="number"]').type('4000');
      cy.contains('Convert').click();
  
      cy.contains('Input Invalid. Please enter a valid whole number between 1 and 3999.').should('be.visible');
    });
  });
  