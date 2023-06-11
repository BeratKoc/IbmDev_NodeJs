const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  let userswithsamename = users.filter((user)=>{
  return user.username === username
});
if(userswithsamename.length > 0){
  return true;
} else {
  return false;
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
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
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

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
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.username; // Assuming the username is stored in the session

  // Find the book by ISBN
  const values=Object.values(books);
  const book = values.find((book) => book.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has already posted a review for the same book
  const existingReview = book.reviews.find((review) => review.username === username);

  if (existingReview) {
    // If the user has already posted a review, modify the existing review
    existingReview.review = review;
    return res.status(200).json({ message: "Review modified successfully" });
  } else {
    // If the user has not posted a review, add a new review for the book
    const newReview = {
      username: username,
      review: review,
    };

    book.reviews.push(newReview);
    return res.status(200).json({ message: "Review added successfully" });
  }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const  isbn  = req.params.isbn;
  const username = req.session.username; // Assuming the username is stored in the session

  // Find the book by ISBN
  const book = books.find((book) => book.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Filter the reviews based on the session username
  const filteredReviews = book.reviews.filter((review) => review.username === username);

  if (filteredReviews.length === 0) {
    return res.status(404).json({ message: "Review not found" });
  }

  // Delete the reviews for the session username
  book.reviews = book.reviews.filter((review) => review.username !== username);

  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
