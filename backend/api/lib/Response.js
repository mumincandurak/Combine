const _enum = require("../config/enum");
const CustemError=require("./CustomError.js")

class Response {
    constructor() { }


    static successResponse(code, data) {
        return {
            code,
            data
        }
    }
    static errorResponse(code, error) {
        if (error instanceof CustemError) {
            return {
                code,
                error: {
                    message: error.message,
                    description: error.description
                }
            }
        }
        return {
            code:_enum.HTTP_STATUS.INTERNAL_SERVER_ERROR,
            error: {
                message: "unknown error",
                description: error.description
            }
        }
    }
}


module.exports = Response;



