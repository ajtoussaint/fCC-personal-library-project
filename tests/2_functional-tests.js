/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {

      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({title: "Test Title"})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body, "response is not an object");
            assert.deepEqual(res.body, {title:"Test Title", _id:res.body._id})
            done();
          })
      });

      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isString(res.body, "body is not a string");
            assert.equal(res.body, "missing required field title")
            done();
          })
      });

    });


    suite('GET /api/books => array of books', function(){

      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end((err, res) =>{
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response should be an array")
            res.body.forEach(book => {
              assert.property(book, "title", "a book has no title");
              assert.property(book, "_id", "a book has no _id");
              assert.property(book, "commentcount", "a book has no comment count");
            })
            done();
          })
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function(){

      test('Test GET /api/books/[id] with id not in db',  function(done){
        let badId = "a6g4sdf6g1111146gsd4f6"
        chai.request(server)
          .get('/api/books/'+badId)
          .end((err, res) =>{
            assert.equal(res.status, 200);
            assert.isString(res.body, "response should be a string");
            assert.equal(res.body, "no book exists", "book should not exist");
            done();
          })
      });

      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .post('/api/books')
          .send({title: "Test Book 2"})
          .end((err, res) => {
            chai.request(server)
            .get("/api/books/" + res.body._id)
            .end((err, res2) =>{
              assert.equal(res2.status, 200);
              assert.isObject(res2.body, "response should be an object");
              assert.isArray(res2.body.comments, "comments should be an array");
              assert.property(res2.body, "title", "book has no title");
              assert.property(res2.body, "_id", "book has no _id");
              assert.property(res2.body, "comments", "book has no comment array");
              done();
            })
          })
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){

      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books')
          .send({title: "Test Book 3"})
          .end((err, res) => {
            chai.request(server)
            .post("/api/books/" + res.body._id)
            .send({comment: "Test comment for TB3"})
            .end((err, res2) =>{
              assert.equal(res2.status, 200);
              assert.isObject(res2.body, "response should be an object");
              assert.isArray(res2.body.comments, "comments should be an array");
              assert.property(res2.body, "title", "book has no title");
              assert.property(res2.body, "_id", "book has no _id");
              assert.property(res2.body, "commentcount", "book has no comment count");
              done();
            })
          })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
          .post('/api/books')
          .send({title: "Test Book 4"})
          .end((err, res) => {
            chai.request(server)
            .post("/api/books/" + res.body._id)
            .send({})
            .end((err, res2) =>{
              assert.equal(res2.status, 200);
              assert.isString(res2.body, "response should be a string");
              assert.equal(res2.body, "missing required field comment");
              done();
            })
          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        let badId = "a6g4sdf6g1111146gsd4f6"
        chai.request(server)
        .post("/api/books/" + badId)
        .send({comment: "test comment for badId"})
        .end((err, res) =>{
          assert.equal(res.status, 200);
          assert.isString(res.body, "response should be a string");
          assert.equal(res.body, "no book exists", "book should not exist");
          done();
        })
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
          .post('/api/books')
          .send({title: "Test Book 5"})
          .end((err, res) => {
            chai.request(server)
            .delete("/api/books/" + res.body._id)
            .end((err, res2) =>{
              assert.equal(res2.status, 200);
              assert.isString(res2.body, "response should be a string");
              assert.equal(res2.body, "delete successful");
              done();
            })
          })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        let badId = "a6g4sdf6g1111146gsd4f6"
        chai.request(server)
        .delete("/api/books/" + badId)
        .end((err, res) =>{
          assert.equal(res.status, 200);
          assert.isString(res.body, "response should be a string");
          assert.equal(res.body, "no book exists", "book should not exist");
          done();
        })
      });

    });

  });

});
