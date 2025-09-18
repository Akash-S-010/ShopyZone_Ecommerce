export const errorHandler = (err, req, res, next) => {
    const status = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.log(err.stack);
    console.log(err.message);
    res.status(status).json({ success: false, status, message});
};
