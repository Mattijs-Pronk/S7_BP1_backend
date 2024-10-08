import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
//controllers
import searchController from "./Controllers/loginController.js";

//env inladen
dotenv.config();

//app aanmaken
const app = express();
app.use(express.json());
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND || 'http://localhost:5173'
}));

//debug aanzetten
mongoose.set('debug', true);
//database connectie maken
mongoose.connect(process.env.URL);

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to database');
});

//server aanmaken
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//controller inlezen
searchController(app)


