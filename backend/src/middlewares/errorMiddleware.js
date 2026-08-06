const errorHandler = (err, req, res, next) => {

    let statusCode = res.statusCode;

    if (statusCode === 200) {
        statusCode = 500;
    }

    res.status(statusCode).json({
        success: false,
        message: err.message,
        stack:
            process.env.NODE_ENV === "production"
                ? null
                : err.stack
    });

};

export default errorHandler;