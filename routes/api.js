/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';
const mongoose = require("mongoose");

module.exports = function (app) {
  mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true });

  let bookSchema = new mongoose.Schema({
    title: {type:String, required: true},
    comments: {type:Array, required: true}
  });

  let Book = mongoose.model("Book", bookSchema);

  function formatBookArr(bookArr){
    let formattedArr = [];
    bookArr.forEach(book => {
      formattedArr.push({
        title:book.title,
        _id:book._id,
        commentcount:book.comments.length
      });
    })
    return formattedArr;
  }

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}, (err, data)=>{
        if (err){console.log(err)}
        res.json(formatBookArr(data));
      })
    })

    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(!title){
        res.json("missing required field title");
      }else{
        let newBook = new Book({
          title: title,
          comments:[]
        });
        newBook.save((err, data)=>{
          if (err){console.log(err)}
          res.json({title:data.title, _id:data._id});
        })
      }

    })

    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      //find all of the books
      Book.find({}, (err, data) => {
        if(err){console.log(err)}
        data.forEach( book => {
          Book.deleteOne({_id:book._id}, (err, data) => {
          })
        });
        res.json("complete delete successful");
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid, (err,data) => {
        if(err){console.log(err)}
        if(!data){
          console.log("book not found");
          res.json("no book exists");
        }else{
            title: data.title,
            _id: data._id,
            comments: data.comments
          });
        }
      });
    })

    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      console.log("ID: ", bookid);
      console.log("comment: ", comment);
      //json res format same as .get
      if(!comment){
        res.json("missing required field comment");
      }else{
        Book.findById(bookid, (err,data) => {
          console.log("found book");
          if(err){console.log(err)}
          if(!data){
            res.json("no book exists");
          }else{
            console.log(data);
            console.log(data.comments);
            data.comments.push(comment);
            data.save((err, updatedData) => {
              res.json({
                title: updatedData.title,
                _id: updatedData._id,
                comments: updatedData.comments
              });
            })
          }
        })
      }
    })

    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findById(bookid, (err,data) => {
        if(err){console.log(err)}
        if(!data){
          res.json("no book exists");
        }else{
          Book.deleteOne({_id:bookid}, (err, data) => {
            if(err){console.log(err)}
            if(data){
              res.json("delete successful");
            }
          })
        }
      })
    });

};
