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
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  const review = req.body.review;
  let l = Object.keys(books[isbn]).review.length + 1;
  Object.keys.books[isbn].reviews.forEach(element => {
    if( username == books[isbn].reviews[element].username){
      books[isbn].reviews[element].review = review
    }
    else{
      books[isbn].reviews={Object.keys(books[isbn]).review.length + 1:{"username":username,"review":review}}
    }
  });
  //if (isbn){
  //  books[isbn].reviews={1:{"username": username,"review":review}}
  //    }


  return res.status(200).send(`The username ${username} has done a review for book with ISBN ${isbn}`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
