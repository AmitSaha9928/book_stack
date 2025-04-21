describe("Login Page", () => {
    const testUser = {
      email: "amit_saha@outlook.com",  
      password: "123123123",
    };
  
    beforeEach(() => {
      cy.visit("/login"); // Adjust path if needed
    });
  
    it("allows a user to log in and redirects to dashboard", () => {
      cy.get('input[name="email"]').type(testUser.email);
      cy.get('input[name="password"]').type(testUser.password);
      cy.get('button[type="submit"]').click();
  
      // Wait for possible alert and redirect
      cy.on('window:confirm', () => true);
  
      cy.url().should("include", "/dashboard");
    });
  
    it("shows error on invalid credentials", () => {
      cy.get('input[name="email"]').type("wrong@example.com");
      cy.get('input[name="password"]').type("wrongpass");
      cy.get('button[type="submit"]').click();
  
      cy.contains("Login Failed").should("be.visible");
    });
  });
  