const chai = require('chai')
const expect = chai.expect;
const {Page, User, db} = require('../models');
chai.use(require('chai-things'))
chai.use(require('chai-as-promised'))
// const Page = require('../models').Page;
// const User = require('../models').User;
// const db = require('../models').db;

describe('Page model', function () {

  describe('Virtuals', function () {
    let page;
    beforeEach(function(){
      page = Page.build({
        title: "Hippo Games", 
        urlTitle: "Hippo_Games",
        content: "# AWESOME"
      })
    })
    describe('route', function () {
      it('returns the urlTitle prepended by "/wiki/"', function () {
        // THIS is where I write assertions (expects)
        // result === savedPage
        expect(page.route).to.equal('/wiki/Hippo_Games')
      })
    });
    describe('renderedContent', function () {
      it('converts the markdown-formatted content into HTML', function () {
        expect(page.renderedContent.trim()).to.equal('<h1 id="awesome">AWESOME</h1>')
      });
    });
  });

  describe('Class methods', function () {
    let page;
    before(function () {
      return db.sync({ force: true })
      .then(() => {
        return Page.create({
          title: "Hippo Games",
          content: "# AWESOME",
          tags: ['cool']
        })
      })
      .then(createdPage => {
        page = createdPage;
      })
    })
    describe('findByTag', function () {
      it('gets pages with the search tag', function() {
        // return is in lieu of done
        
        // return expect(Page.findByTag('cool')).to.eventually.be.an('array').that.has.length(1).that.contains.a.thing.with.property('id', page.id)

        return Page.findByTag('cool')
          .then(foundInstancesArray => {
            expect(foundInstancesArray).to.be.an('array').that.has.length(1)
            expect(foundInstancesArray).to.contain.a.thing.with.property('id', page.id)
          })
      });
      it('does not get pages without the search tag', function () {
        return Page.findByTag()
          .then(foundInstancesArray => {
            expect(foundInstancesArray).to.be.an('array')
            expect(foundInstancesArray).that.has.length(0)
          })
      });
    });
  });

  describe('Instance methods', function () {
    let hippoPage, jaguarPage, whalePage;
    before(function () {
      return db.sync({ force: true })
      .then(() => {      
        return Promise.all([
          Page.create({
            title: "Hippo Games",
            content: "# AWESOME",
            tags: ['cool']
          }),
          Page.create({
            title: "Jaguar Games",
            content: "# AWESOME",
            tags: ['cool']
          }),
          Page.create({
            title: "Whale Games",
            content: "# AWESOME",
            tags: ['squishy']
          })
        ])
      })
      .then(([createdHippoPage, createdJaguarPage, createdWhalePage]) => {
        hippoPage = createdHippoPage;
        jaguarPage = createdJaguarPage;
        whalePage = createdWhalePage;
      })
    })
    describe('findSimilar', function () {
      it('never gets itself', function () {
        return hippoPage.findSimilar()
          .then(foundSimilarArray => {
            expect(foundSimilarArray).to.be.an('array').that.has.length(1)
            expect(foundSimilarArray).to.not.contain.thing.with.property('id', hippoPage.id)
          })
      });
      it('gets other pages with any common tags', function () {
        return hippoPage.findSimilar()
          .then(foundSimilarArray => {
            expect(foundSimilarArray).to.be.an('array').that.has.length(1)
            expect(foundSimilarArray).to.contain.thing.with.property('id', jaguarPage.id)
          })
      });
      it('does not get other pages without any common tags', function () {
        return hippoPage.findSimilar()
          .then(foundSimilarArray => {
            expect(foundSimilarArray).to.be.an('array').that.has.length(1)
            expect(foundSimilarArray).to.not.contain.thing.with.property('id', whalePage.id)
          })
      });
    });
  });

  describe('Validations', function () {
    it('errors without title', function (done) {
      let page = Page.build({})

      page.validate()
        .catch(err => {
          expect(err).to.exist;
          expect(err.errors).to.contain.thing.with.property('path', 'title')
          done()
        })
        .then(result => {
          expect(result).to.not.exist
        })
        .catch(done)

    });
    it('errors without content', function(done) {
      let page = Page.build({})

      page.validate()
        .catch(err => {
          expect(err).to.exist;
          expect(err.errors).to.contain.thing.with.property('path', 'content')
          done()
        })
        .then(result => {
          expect(result).to.not.exist
        })
        .catch(done)
    });
    it('errors given an invalid status', function (done) {
      let page = Page.build({
        title: 'Hippo',
        content: 'Hippos',
        status: 'large'
      })

      page.save()
        .catch(err => {
          expect(err).to.exist;
          expect(err.message).to.contain('status')
          done()
        })
        .then(result => expect(result).to.not.exist)
        .catch(done)
    });
  });

  describe('Hooks', function () {
    xit('xit sets urlTxitle based on txitle before validating');
  });

});