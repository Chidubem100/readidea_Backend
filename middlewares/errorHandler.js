
const { StatusCodes } = require('http-status-codes');



const errorHandler = (err,req,res,next) =>{

    let customError = {
        statuscode:err.StatusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong, please try again'
    }


    return res.status(customError.statuscode).json({success: false, msg: customError.msg});
    
}

// validation error
// duplicate error
// cast error




module.exports = errorHandler;