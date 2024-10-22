
describe('Cypress API tests', () => {

  beforeEach('login to Application', () => {
    cy.loginToApplication()
  }) 

  it('verify correct request & response', () => {
    cy.intercept('POST', 'https://conduit-api.bondaracademy.com/api/articles/').as('postArticles')

    cy.contains('New Article').click()
    cy.get('[placeholder="Article Title"]').click().type('test article title')
    cy.get('[formcontrolname="description"]').click().type('test article description')
    cy.get('[placeholder="Write your article (in markdown)"]').click().type('test article body')
    cy.contains('Publish Article').click()

     // wait for API call to finish
    cy.wait('@postArticles').then( xhr => { 
      console.log(xhr)
      
      // request assertions
      expect(xhr.request.body.article.body).to.equal('test article body')
      expect(xhr.request.body.article.description).to.equal('test article description')
      expect(xhr.request.body.article.title).to.equal('test article title')
      expect(xhr.request.method).to.equal('POST')

      // response assertions
      expect(xhr.response.statusCode).to.equal(201)
      expect(xhr.response.body.article.author.username).to.equal('mwaugh8')
      expect(xhr.response.body.article.body).to.equal('test article body')
      expect(xhr.response.body.article.description).to.equal('test article description')
      expect(xhr.response.body.article.title).to.equal('test article title')
      

    })
  })
})