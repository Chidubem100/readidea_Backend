const errorHandler = (err,req,res,next) =>{
    return res.status(500).json({msg: 'something went wrong'});
    
}

// validation error
// duplicate error
// cast error




module.exports = errorHandler;