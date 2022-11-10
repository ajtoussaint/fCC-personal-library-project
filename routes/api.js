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
        console.log("found all books and sending response");
        res.json(formatBookArr(data));
      })
    })

    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(!title){
        res.send("missing required field title");
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
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })

    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });

};
