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
        /*
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
        */
        describe('findByTag', function () {
            beforeEach(function(){
                return Promise.all([
                    Page.create({
                        title: 'Test Page 1',
                        content: 'this is content 1',
                        tags:['misc', 'test', 'star-war']
                    }),
                    Page.create({
                        title: 'Test Page 2',
                        content: 'Other stuff',
                        tags:['misc', 'star-wars', 'fsa']
                    })
                ]);
            });
           
            it('gets pages with the search tag', function (done) {
                Page.findByTag('test')
                    .then(function (pages) {
                       // console.log("here is pages: ",pages)
                        expect(pages).to.have.lengthOf(1);
                        expect(pages[0].title).to.equal('test page 1');
                        done();
                    })
                    .catch(done);
            });

            it('does not get pages without the search tag', function (done) {
                return Page.findByTag('foobar')
                           .then(function(pages){
                            expect(pages).to.have.lengthOf(0);
                           });
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





 describe('Instance methods', function () {
   
   describe('findSimilar', function () {

    var rosePage, berryPage, bananaPage;
    beforeEach(function(){
        return Promise.all([
            Page.create({
                title: 'Rose',
                content:'pretty flowers, watch out for thorns',
                tags:['flower', 'red']
            }),
            Page.create({
                title: 'Strawberry',
                content:'Edible things, dip in chocolate',
                tags:['red','fruit']
            }),
            Page.create({
                title:'Banana',
                content:'Edible things, dip in penut butter',
                tags:['fruit', 'yellow']
            })

        ])
         .spread(function(_p1, _p2, _p3){
            rosePage=_p1;
            berryPage=_p2;
            bananaPage=_p3;
         });
    });

     it('never gets itself', function(){
        berryPage.findSimilar()
            .then(function(similar){
                expect(similar).to.not.contain.a.thing.with.property('id', berryPage.id);
            })
     });




     it('gets other pages with any common tags', function(){
        return berryPage.findSimilar()
                        .then(function(similar){
                            expect(similar).to.have.lengthOf(2);
                            expect(similar).to.contain.a.thing.with.property('id', rosePage.id);
                            expect(similar).to.contain.a.thing.with.property('id', bananaPage.id);
                        });
     });


     it('does not get other pages without any common tags', function(){
        return bananaPage.findSimilar()
                         .then(function(similar){
                            expect(similar).to.have.lengthOf(1);
                            expect(similar).to.contain.a.thing.with.property('id', berryPage.id);
                            
                        });
     });
   });
 });


 describe('Validations', function () {
   it('errors without title',function(){
    var page=Page.build({});
    return page
            .validate()
            .catch(function(err){
                expect(err).to.exist;
                expect(err.errors).to.contain.a.thing.with.property('path','title');
            });
   });

   it('errors without content',function(){
    var page=Page.build({});
    return page
           .validate()
           .catch(function(err){
            expect(err).to.exist;
            expect(err.errors).to.contain.a.thing.with.property('path','content');
           });
   });
   it('errors given an invalid status',function(){
    var page=Page.build({
        title:'kjkja',
        content:'askjka',
        status:'evil'
    })
     return page
               .save()
               .then(function(){
                throw Error('Promise should have rejected');
               }, function(err){
                 expect(err).to.exist;
                 expect(err.message).to.contain('status');
               });
   });

   it ('will be valide with the abve stuff', function(){
    var page=Page.build({
        title:'foobar',
        content:'Foos and bars but together'
    });
     return page.save();
   });
 });

 describe('Hooks', function () {
   it('it sets urlTitle based on title before validating', function(){

       var page=Page.build({
           title:'the who',
           content:'a band on first base'
       });
       return page.save()
                  .then(function(){
                    expect(page.urlTitle).to.equal('the who');
                  })
     });
    });

 });