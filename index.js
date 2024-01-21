require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const path = require('path')
const cors = require('cors')
require('express-async-errors')


const app = express()
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use('/public', express.static('public'));



const port = process.env.PORT || 3000;

// local
mongoose.connect("mongodb://localhost:27017/webYaparDB",{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    family: 4,
})

// Configure CORS
const corsOptions = {
    origin: '*', // Update with your frontend's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Enable CORS credentials (cookies, authorization headers, etc.)
    allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));

// MongoDB Connection
// try {
//     // MongoDB Connection
//     mongoose.connect(process.env.MONGO_URI_MAIN, {
//         useNewUrlParser: true, 
//         useUnifiedTopology: true,
//         family: 4,
//     }).catch(error => {
//         console.log(error)
//     });

//     const db = mongoose.connection

//     db.on('error', (err) => {
//         console.error('MongoDB connection error:', err);
//         // Log the error or handle it appropriately without stopping the application
//         // For instance, you can choose to log the error and continue the server running
//     });

//     db.once('open', () => {
//         console.log('Connected to MongoDB');
//         // Perform additional actions when the MongoDB connection is successful
//     });
// } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//     // Handle the error as needed (logging, custom response, etc.)
// }

const adminRoutes = require("./Routes/adminRoutes")
const userRoutes = require("./Routes/userRoutes")

app.use("/admin",adminRoutes)
app.use("/user",userRoutes)

app.use((err, req, res, next) => {
    console.log(err)
    res.status(err.status || 500).json({
        message : `Internal server error!`,
        success : false
    })
})

app.listen(port,()=>{
    console.log(`Server is running on the port ${port}`);
})