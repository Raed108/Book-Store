import express from 'express';
import { Book } from '../models/bookModel.js';
import axios from 'axios';


const router = express.Router();


router.post('/', async (req, res) => {
    try{
        if (!req.body.title || !req.body.author || !req.body.publishYear) {
            return res.status(400).send({ message: 'All fields are required' });
        }
        if (req.body.publishYear < 0) {
            return res.status(400).send({ message: 'Publish year cannot be negative' });
        }
        if(!req.body.description){
            req.body.description = 'No description available.';
        }
        const newbook ={
            title: req.body.title,
            author: req.body.author,
            publishYear: req.body.publishYear,
            description: req.body.description,
        };

        const book = await Book.create(newbook);
        return res.status(201).send(book);
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: error.message })
    }
})

router.post('/oneBook', async (req, res) => {
    try {
        const { title, author, publishYear, description } = req.body;

        // Check for missing fields
        if (!title || !author || !publishYear) {
            return res.status(400).send({ message: 'Title, author, and publishYear are required' });
        }

        let finalDescription = description;

        // If no description is provided, fetch it from the Google Books API
        if (!description) {
            try {
                const apiResponse = await axios.get(
                    `https://www.googleapis.com/books/v1/volumes?q=title:${encodeURIComponent(title)}+author:${encodeURIComponent(author)}`
                );

                const bookData = apiResponse.data.items[0];

                // If the book has a description in the API, use it
                if (bookData && bookData.volumeInfo && bookData.volumeInfo.description) {
                    finalDescription = bookData.volumeInfo.description;
                } else {
                    finalDescription = 'No description available.';
                }
            } catch (apiError) {
                console.log('Error fetching description:', apiError.message);
                return res.status(500).send({ message: 'Failed to fetch description from external source' });
            }
        }


        // Create a new book object with the description
        const newBook = {
            title,
            author,
            publishYear,
            description: finalDescription
        };

        // Save the new book to the database
        const book = await Book.create(newBook);
        return res.status(201).send(book);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});


// router.post('/manyBooks', async (req, res) => {
//     try {
//         const books = req.body.books; // Assuming an array of books is sent in 'books'
        
//         // Check if the 'books' array exists and has at least one book
//         if (!books || books.length === 0) {
//             return res.status(400).send({ message: 'Books array is required and cannot be empty' });
//         }

//         // Iterate over the array to validate each book object
//         const invalidBooks = books.filter(book => {
//             return !book.title || !book.author || !book.publishYear || !book.description;
//         });

//         if (invalidBooks.length > 0) {
//             return res.status(400).send({ message: 'All fields (title, author, publishYear) are required for each book' });
//         }

//         // Create each book and return the array of created books
//         const createdBooks = await Book.insertMany(books);

//         return res.status(201).send(createdBooks);
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).send({ message: error.message });
//     }
// });

router.post('/manyBooks', async (req, res) => {
    try {
        const books = req.body.books; // Assuming an array of books is sent in 'books'
        
        // Check if the 'books' array exists and has at least one book
        if (!books || books.length === 0) {
            return res.status(400).send({ message: 'Books array is required and cannot be empty' });
        }

        // Function to fetch description from Google Books API
        const fetchDescription = async (title, author) => {
            try {
                const response = await axios.get(
                    `https://www.googleapis.com/books/v1/volumes?q=title:${encodeURIComponent(title)}+author:${encodeURIComponent(author)}`
                );
                const bookData = response.data.items[0];
                return bookData && bookData.volumeInfo && bookData.volumeInfo.description
                    ? bookData.volumeInfo.description
                    : 'No description available.';
            } catch (error) {
                console.log('Error fetching description:', error.message);
                return 'No description available.';
            }
        };

        // Process each book, fetch missing descriptions
        const processedBooks = await Promise.all(books.map(async book => {
            // If description is missing, fetch it
            if (!book.description) {
                book.description = await fetchDescription(book.title, book.author);
            }
            return book;
        }));

        // Validate each book object
        const invalidBooks = processedBooks.filter(book => {
            return !book.title || !book.author || !book.publishYear;
        });

        if (invalidBooks.length > 0) {
            return res.status(400).send({ message: 'All fields (title, author, publishYear) are required for each book' });
        }

        // Create each book and return the array of created books
        const createdBooks = await Book.insertMany(processedBooks);

        return res.status(201).send(createdBooks);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});


router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        return res.status(200).send({
            count: books.length,
            data: books,
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (book) {
            return res.status(200).send(book);
        }
        return res.status(404).send({ message: 'Book not found' });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
})

router.put('/:id', async (req, res) => {
    try {
        if (
            !req.body.title || !req.body.author || !req.body.publishYear 
        ) {
            return res.status(400).send({ message: 'All fields are required' });
        }

        const result = await Book.findByIdAndUpdate(req.params.id , req.body);
        if(!result){
            return res.status(404).json({ message: 'Book not found' });
        }
        return res.status(200).send({ message: 'Book updated successfully' });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (book) {
            return res.status(200).send({ message: 'Book deleted successfully' });
        }
        return res.status(404).send({ message: 'Book not found' });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
})

export default router;