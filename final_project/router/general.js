const express = require('express');
let books = require("./booksdb.js");
const { use } = require('../../../Practice Project/router/friends.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let fileterUser = users.filter((user) => {
    return user.username == username;
  });

  if(fileterUser.length > 0){
    return true;
  }else{
    return false;
  }
}


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  //check if username and password are valid
  if(username && password){
    if(!doesExist(username)){
      users.push({"username":username, "password":password});
      return res.status(200).json({message: username + " has been successfully registered."});
    }else{
      return res.status(404).json({message: "User already exists"});
    }
  }else{
    return res.status(404).json({message: "Please enter a valid username and password."});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let filterBooks = books[isbn];
  if(filterBooks){
    res.send(JSON.stringify(filterBooks, null, 4));
  }else{
    res.send("Sorry, we do not have that book.");
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let filteredBooks = [];
  for(var eachBook in books){
    if(books[eachBook]['author'].toLowerCase() == author.toLowerCase()){
      filteredBooks.push(books[eachBook]);
    }
  }
  if(filteredBooks.length > 0){
    return res.send(filteredBooks);
  }else{
    return res.send("No books by "+author+" found.");
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let filteredBooks = [];
  for(var eachBook in books){
    if(books[eachBook]['title'].toLowerCase() == title.toLowerCase()){
      filteredBooks.push(books[eachBook]);
    }
  }
  if(filteredBooks.length > 0){
    return res.send(filteredBooks);
  }else{
    return res.send(title+" not found.");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let filterBooks = books[isbn];
  if(filterBooks){
    let reviews = filterBooks['reviews'];
    console.log(filterBooks);
    console.log(reviews);
    if(reviews){
      res.send(JSON.stringify(reviews, null, 4));
    }else{
      res.send("This book does not have any reviews");
    }
  }else{
    res.send("Sorry, we do not have that book.");
  }
});

module.exports.general = public_users;
