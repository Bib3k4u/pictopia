const express = require('express');
const multer = require('multer');
const { Sequelize, DataTypes, where } = require('sequelize');
const cors = require('cors');

const app = express();
const port = 5000;

// Use CORS middleware
app.use(cors());

// Sequelize configuration
// const sequelize = new Sequelize('pictopia', 'root', 'root', {
const sequelize = new Sequelize('be6axegwinxc7baavyk7', 'ueedchmdqfnvwyv1', 'f95pKdsST0VJrBpG0OjL', {
    host: 'be6axegwinxc7baavyk7-mysql.services.clever-cloud.com',
    dialect: 'mysql'
});

// Define Image model
const Image = sequelize.define('Image', {
    filename: {
        type: DataTypes.STRING
    },
    data: {
        type: DataTypes.BLOB('long'),
    }
});

// Synchronize the model with the database
sequelize.sync();

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: multer.memoryStorage() });

// Route for handling image uploads
app.post('/api/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        // Save image to database
        const savedImage = await Image.create({
            filename: req.file.originalname,
            data: req.file.buffer.toString('base64'),
            // Accessing the buffer value
        });
        // console.log('Image saved to database:', savedImage);
        res.json({ message: 'Image uploaded successfully' });
    } catch (error) {
        console.error('Error saving image to database:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route for fetching images from the database
app.get('/api/images', async (req, res) => {
    try {
        // Fetch all images from the database
        const query = `select data from Images;`
        const response = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
        res.json(response);
        console.log(response)
    } catch (error) {
        console.error('Error fetching images from database:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
