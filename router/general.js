const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   res.send(JSON.stringify(books,null,4));
//   return res.status(300).json({message: "Yet to be implemented"});
// });
public_users.get('/', function (req, res) {
  // Create a promise to retrieve the books
  const getBooksPromise = new Promise(function (resolve, reject) {
    // Resolve the promise with the books data
    resolve(books);
  });

  // Handle the promise using callbacks
  getBooksPromise
    .then(function (books) {
      res.send(JSON.stringify(books, null, 4)); // Send the books as a JSON response
    })
    .catch(function (error) {
      console.log(error);
      return res.status(500).json({ message: "Error retrieving books" });
    });
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   const isbn=req.params.isbn
//   res.send(books[isbn]);
//   return res.status(300).json({message: "Yet to be implemented"});
//  });
 public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  // Create a promise to retrieve the book
  const getBookPromise = new Promise(function (resolve, reject) {
    if (books.hasOwnProperty(isbn)) {
      resolve(books[isbn]); // Resolve the promise with the book data
    } else {
      reject(new Error("Book not found")); // Reject the promise with an error
    }
  });

  // Handle the promise using callbacks
  getBookPromise
    .then(function (book) {
      res.send(JSON.stringify(book, null, 4)); // Send the book as a JSON response
    })
    .catch(function (error) {
      console.log(error);
      return res.status(404).json({ message: "Book not found" });
    });
});

// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   const author=req.params.author;
//   const values=Object.values(books);
//   let books_filtered=values.filter((book)=>book.author===author)
//   res.send(books_filtered)
//   return res.status(300).json({message: "Yet to be implemented"});
// });
 public_users.get('/author/:author', function (req, res) {
   const author = req.params.author;

//  // Create a promise to retrieve the books by author
   const getBooksByAuthorPromise = new Promise(function (resolve, reject) {
   const values = Object.values(books);
     const booksFiltered = values.filter((book) => book.author === author);           //12 Task

     if (booksFiltered.length > 0) {
      resolve(booksFiltered); // Resolve the promise with the filtered books
     } else {
       reject(new Error("Books not found")); // Reject the promise with an error
     }
   });

   // Handle the promise using callbacks
   getBooksByAuthorPromise
     .then(function (booksFiltered) {
       res.send(JSON.stringify(booksFiltered, null, 4)); // Send the filtered books as a JSON response
     })
     .catch(function (error) {
       console.log(error);
       return res.status(404).json({ message: "Books not found" });
     });
 });

//      Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   let title=req.params.title
//   const values=Object.values(books);
//   let books_filtered=values.filter((book)=>book.title===title)
//   res.send(books_filtered)
//   return res.status(300).json({message: "Yet to be implemented"});
// });
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  // Create a promise to retrieve the books by title
  const getBooksByTitlePromise = new Promise(function (resolve, reject) {
    const values = Object.values(books);
    const booksFiltered = values.filter((book) => book.title === title);

    if (booksFiltered.length > 0) {
      resolve(booksFiltered); // Resolve the promise with the filtered books
    } else {
      reject(new Error("Books not found")); // Reject the promise with an error
    }
  });

  // Handle the promise using callbacks
  getBooksByTitlePromise
    .then(function (booksFiltered) {
      res.send(JSON.stringify(booksFiltered, null, 4)); // Send the filtered books as a JSON response
    })
    .catch(function (error) {
      console.log(error);
      return res.status(404).json({ message: "Books not found" });
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn=req.params.isbn
  const values=Object.values(books);
  let books_filtered=values.filter((book)=>book.isbn===isbn).map((book)=>book.reviews)
  res.send(books_filtered)
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
