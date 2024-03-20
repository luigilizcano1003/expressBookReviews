const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  }
  if(!username){
    return res.status(404).json({message: "Username not valid!"});
  } 
  if(!password){
    return res.status(404).json({message: "Password not valid"});
  }
  
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  //Write your code here
  try{
    return res.status(200).send(JSON.stringify(books,null,4))
  }
  catch (error){
    console.error(error);
    return res.status(404).json({message:"Error"})
  }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  //Write your code here
  try{
    const isbn = await req.params.isbn;
    return res.status(200).send(JSON.stringify(books[isbn],null,4));
  }
  catch (error){
    console.error(error);
    return res.status(404).json({message:"Error"})
  }  
 });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  //Write your code here
  try{
    let key = await {};
    Object.keys(books).forEach(element => {
      if(req.params.author == books[element].author){
      key[element]=books[element]
      }   
    });
    return res.status(200).send(JSON.stringify(key,null,4));
  }
  catch (error){
    console.error(error);
    return res.status(404).json({message:"Error"})
  }  
});

// Get all books based on title
public_users.get('/title/:title',async (req, res) => {
  //Write your code here
  try{
    let key = await {};
    Object.keys(books).forEach(element => {
      if(req.params.title == books[element].title){
      key[element]=books[element]
      }   
    });
    return res.status(200).send(JSON.stringify(key,null,4));
  }
  catch (error){
    console.error(error);
    return res.status(404).json({message:"Error"})
  }  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books[req.params.isbn].reviews,null,4));
});

module.exports.general = public_users;
