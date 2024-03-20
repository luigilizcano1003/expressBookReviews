const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user)=>{
  return user.username === username
});
if (userswithsamename.length > 0 ){
  return false
}
else{
  return true
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
  return (user.username === username && user.password === password)
});
if(validusers.length > 0){
  return true;
} else {
  return false;
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: '1h' });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).json({message:"User successfully logged in"});
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  let l = Object.keys(books[isbn].reviews).length + 1;
  if(Object.keys(books[isbn].reviews).length > 0){
    let i = 0;
    Object.keys(books[isbn].reviews).forEach(element => {      
      if( req.session.authorization.username == books[isbn].reviews[element].username){
        books[isbn].reviews[element].review = review;
        i=i+1;
      }
    })
    if(i==0){
      Object.assign(books[isbn].reviews,{[l]:{"username":req.session.authorization.username,"review":review}})
    }
  }
  else{
    Object.assign(books[isbn].reviews,{[l]:{"username":req.session.authorization.username,"review":review}})
    }
  return res.status(200).send(`The username ${req.session.authorization.username} has done a review; ${review} for book with ISBN ${isbn}`);
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const l= Object.keys(books[isbn].reviews).length;
  let j=0;
  Object.keys(books[isbn].reviews).forEach(element =>{
    if( req.session.authorization.username == books[isbn].reviews[element].username){
      j=element;
      }
    });    
  if(j>0){
    let m=1;
    delete books[isbn].reviews[j];
    Object.keys(books[isbn].reviews).forEach(element =>{
      books[isbn].reviews[m]=books[isbn].reviews[element];
      m=m+1;
    })
    delete books[isbn].reviews[l];
    res.status(200).send(`The review of ${req.session.authorization.username} for book with ISBN ${isbn} has been deleted`);
  }
  if(j==0){
    res.status(208).send(`The username ${req.session.authorization.username} does not have any review for book with ISBN ${isbn}`);
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
