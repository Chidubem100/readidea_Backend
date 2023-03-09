require('dotenv').config();
require('express-async-errors');

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helment = require('helmet');
const app = express();

// Routes
const authRoute = require('./routes/authRoute');
const postRoutes = require('./routes/postRoute');
<<<<<<< HEAD
const commentRoute = require('./routes/commentRoute');

=======
const userRoutes =require('./routes/userRoute');
>>>>>>> e961795e48470651e60137757c92cb74b3ba5762

// OTHER PACKAGES
const connectDB = require('./db/connectDB');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notfound');


// APP CONFIG
app.use(express.json());
app.use(morgan('tiny'));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(cors());
app.use(helment());

// USE ROUTES
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/auth', authRoute);
<<<<<<< HEAD
app.use('/api/v1/comment', commentRoute);
=======
app.use('/api/v1/user', userRoutes);
>>>>>>> e961795e48470651e60137757c92cb74b3ba5762

// Home route
app.get('/', (req,res) =>{
    console.log(req.signedCookies)
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


