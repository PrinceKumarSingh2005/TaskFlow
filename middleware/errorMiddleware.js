const errorMiddleware = (error, req, res, next) => {
 
    
    

    
    if(error.name === "CastError"){
        error.statusCode = 400;
        error.message = "Invalid task ID";
    }
    
    let errors = {};

    if(error.name === "ValidationError"){
        error.statusCode = 400;

        const fields = Object.keys(error.errors);
        
        for(let field of fields){
            errors[field] = error.errors[field].message;
        }
        console.log(errors);

    }

    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
        statusCode: statusCode,
        message: error.message,
        
        errors: errors
    });
};

module.exports = errorMiddleware;