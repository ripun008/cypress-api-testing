
describe('Cypress API tests', () => {

  beforeEach('login to Application', () => {
    cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/tags', {fixture: 'tags.json'})
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

  // mocking a response
  it('verify popular tags are displayed', () => {
    cy.get('.tag-list')
    .should('contain', 'cypress')
    .and('contain', 'automation')
    .and('contain', 'testing')
  })

  it.only('verify global feed likes count', () => {
    cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles/feed*', '{"articles":[],"articlesCount":0}')
    cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles*', { fixture: 'articles.json'})
    

    cy.contains('Global Feed').click()
    cy.get('app-article-list button').then( heartList => {
      expect(heartList[0]).to.contain('1')
      expect(heartList[1]).to.contain('5')
    })

    cy.fixture('articles.json').then( file => {
      const articleLink = file.articles[1].slug
      file.articles[1].favoritesCount = 6
      cy.intercept('POST', 'https://conduit-api.bondaracademy.com/api/articles/'+articleLink+'/favorite', file)
    })

    cy.get('app-article-list button').eq(1).click().should('contain', '6')
  })
})