import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { Book } from './models/bookModel.js';
import bookRoute from './routes/booksRoute.js';
import cors from 'cors';

dotenv.config(); 


const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;


const app = express();

app.use(express.json());

app.use(cors());

// app.use(cors({
//     origin: 'http://localhost:3000',
//     methods: ["GET","POST","PATCH","DELETE"],
//     allowedHeaders: 'Content-Type',
// }));

app.get('/', (req, res) => {
    console.log(req)
    return res.status(234).send('Hello World');
});

app.use('/books', bookRoute);

mongoose
.connect(MONGO_URL)
.then(() => {
    console.log("App connected to database")
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((err) =>{
    console.log(err)
});