const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

public_users.get('/async/books', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books" });
    }
});


public_users.get('/async/isbn/:isbn', (req, res) => {
    axios
        .get(`http://localhost:5000/isbn/${req.params.isbn}`)
        .then(response => res.json(response.data))
        .catch(() =>
            res.status(404).json({ message: "Book not found" })
        );
});

public_users.get('/async/author/:author', async (req, res) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/author/${req.params.author}`
        );
        res.json(response.data);
    } catch (error) {
        res.status(404).json({ message: "Author not found" });
    }
});

public_users.get('/async/title/:title', async (req, res) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/title/${req.params.title}`
        );
        res.json(response.data);
    } catch (error) {
        res.status(404).json({ message: "Title not found" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        res.send(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let result = [];

    Object.values(books).forEach(book => {
        if (book.author === author) {
            result.push(book);
        }
    });

    if (result.length > 0) {
        res.send(result);
    } else {
        res.status(404).json({ message: "No books found for this author" });
    }
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let result = [];

    Object.values(books).forEach(book => {
        if (book.title === title) {
            result.push(book);
        }
    });

    if (result.length > 0) {
        res.send(result);
    } else {
        res.status(404).json({ message: "No books found with this title" });
    }
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        res.send(book.reviews);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});


module.exports.general = public_users;
