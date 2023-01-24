
const connection = {
    HOST: "localhost",
    PORT: 27017,
    DB: "ReadIdea_db"
}

const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
const connectDB = () =>{
    try {
        mongoose.connect(`mongodb://${connection.HOST}:${connection.PORT}/${connection.DB}`, {
        
        });
        // console.log('db connected')
    } catch (error) {
        console.log(error)
    }
}


module.exports = connectDB;