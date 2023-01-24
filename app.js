require('dotenv').config();
require('express-async-errors');


const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helment = require('helmet');
const app = express();

// OTHER PACKAGES
const connectDB = require('./db/connectDB');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notfound');



// APP CONFIG
app.use(express.json());
app.use(morgan('tiny'));
app.use(cookieParser());
app.use(cors());
app.use(helment());



// Home route
app.get('/', (req,res) =>{
    res.send('<h1>Read idea Api</h1><a href>Documentation</a>')
});

// errorHandler and notFound middlewares
app.use(errorHandler);
app.use(notFound);



// server set_up()
const port = process.env.PORT || 5000
const start = async() =>{
    try {
        await connectDB();
        app.listen(port, () =>{
            console.log(`server have started on port ${port}!!! `)
        })
    } catch (error) {
        console.log(error);
    }
}

start();


// app.listen(port,  () =>{
    // console.log('server is test running!')
// });

