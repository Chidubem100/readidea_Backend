const CustomApiError = require('./customError');
const BadRequestError = require('./badRequest');
const UnauthenticatedError = require('./unauthenticated');
const UnauthorizedError = require('./unauthorized');
const NotFoundError = require('./not-found');




module.exports = {
    CustomApiError,
    BadRequestError,
    UnauthenticatedError,
    UnauthorizedError,
    NotFoundError,
}


// unauthenticated(unauthorized)
// unauthorized(forbidden)
// notfound(notFound)