var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);
const supertest = require('supertest');
const app = require('../app.js');
const agen = supertest(app);
var models = require('../models');
var Page = models.Page;
var User = models.User;
const agent = supertest(app);
const { expect } = require('chai');


describe('Page model', function () {

    beforeEach(function (done) {
        //sync
        User.sync({ force: true })
            .then(function () {
                return Page.sync({ force: true });
            })
         .then (function(){
             done()
         })
         .catch(done)
    })

    describe('Virtuals', function () {

        let page;
        beforeEach(function () {
            page = Page.build();
        });

        describe('route', function () {
            it('returns the urlTitle prepended by "/wiki/"', function () {
                page.urlTitle = 'some_title';
                expect(page.route).to.equal('/wiki/some_title');
            });
        });
        describe('renderedContent', function () {
            it('converts the markdown-formatted content into HTML', function () {
                page.content = 'content'
                expect(page.renderedContent).to.equal('<p>content</p>\n');
            });
        });
    });

    describe('Class methods', function () {
        beforeEach(function (done) {
            Page.create({
                title: 'foo',
                content: 'bar',
                tags: ['foo', 'bar']
            })
                .then(function () {
                    done();
                })
                .catch(done);

        });
        describe('findByTag', function () {
           
            it('gets pages with the search tag', function (done) {
                Page.findByTag('bar')
                    .then(function (pages) {
                       // console.log("here is pages: ",pages)
                        expect(pages).to.have.lengthOf(1);
                        done();
                    })
                    .catch(done);
            });

            it('does not get pages without the search tag', function (done) {
                Page.findByTag('falafel')
                    .then(function (pages) {
                        expect(pages).to.have.lengthOf(0);
                        done();
                    })
                    .catch(done);
            });
        });

    });




//before testing tags, create a page entry with tags
// before(function (done) {
//     Page.create({
//       title: 'my title',
//       content: 'some content here',
//       tags: ['grace', 'hopper']
//     })
//     .then(function () {
//       done();
//     })
//     .catch(done);
//   });  




    //  it('gets pages with the search tag', function(done){
    //    Page.findByTag('grace')
    //    .then(function(pages){
    //        expect(pages).to.have.lengthOf(1);
    //        done()
    //    })
    //    .catch(done);
    // });

    //  it('does not get pages without the search tag');
    // });





//  describe('Instance methods', function () {
//    describe('findSimilar', function () {
//      it('never gets itself');
//      it('gets other pages with any common tags');
//      it('does not get other pages without any common tags');
//    });
//  });

//  describe('Validations', function () {
//    it('errors without title');
//    it('errors without content');
//    it('errors given an invalid status');
//  });

//  describe('Hooks', function () {
//    it('it sets urlTitle based on title before validating');
//  });

 });