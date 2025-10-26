module.exports = {
    "PORT": process.env.PORT || 3000,
    "LOG_LEVET" : process.env.LOG_LEVEL || "debug",
    "CONNECTION_STRING": process.env.CONNECTION_STRING || "mongodb://localhost:27017/WardropDB"   

};