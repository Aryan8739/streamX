// using promise.catch
const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch((err) => {
            res.status(err.code || 500).json({
                success: false,
                message: err.message || 'Internal Server Error'
            });
        });
}
}


export {asyncHandler }



// const asyncHandler= (fn) => () => {}
// const asyncHandler= (fn) => () => {}
// const asyncHandler = (fn) => asyncHandler() => {}


    // Using try catch
    // const asyncHandler = (fn) => async (req, res, next) => {
    //     try { 
    //         await fn(req, res, next);
    //     }
    //     catch(err) {
    //         res.status(err.code || 500).json({
    //             sucess: false,
    //             message: err.message || 'Internal Server Error'});
    //     }
    // }
