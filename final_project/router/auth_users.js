const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let fileterUser = users.filter((user) => {
    return user.username == username;
  });

  if(fileterUser.length > 0){
    return true;
  }else{
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
});

if (validusers.length > 0) {
    return true;
} else {
    return false;
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({message: "Error logging in."});
  }
  if(authenticatedUser(username,password)){
    let accessToken = jwt.sign({
      data: password
    }, 'access', {expiresIn: 60 *60 });//valid for an hour
  
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("Customer successfully logged in");
  }else{
    return res.status(208).json({message: "Invalid login details. Check your username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const user = req.session.authorization.username;
  const isbn = req.params.isbn;
  const reviewText = req.body.review;

  let filterBook = books[isbn];
  let bookReviews = filterBook['reviews'];

  if(bookReviews[user]){
    bookReviews[user]['review'] = reviewText;
    //filterBook['reviews'] = bookReviews;
    return res.status(200).send("The review for book with ISBN: "+isbn+" has been updated.");
  }

  bookReviews[user] = {"review": reviewText};
  return res.status(200).send("The review for book with ISBN: "+isbn+" has been added.");
});

// Delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const user = req.session.authorization.username;
  const isbn = req.params.isbn;

  let filterBook = books[isbn];
  let bookReviews = filterBook['reviews'];
  if(bookReviews[user]){
    delete bookReviews[user];
    return res.status(200).send("Review for ISBN: "+isbn+" posted by user: "+user+" has been deleted.");
  }
  return res.status(403).send("You do not have a review to delete.");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
