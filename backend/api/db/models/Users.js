const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = mongoose.Schema({
    userName: { type: String, required: true},
    email: { type: String, required: true},
    passwordHash: { type: String, required: true},
    isActive: { type: Boolean, default: true},
    preferences: String
},{
    versionKey: false, 
    timestamps:{
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
}
);

class Users extends mongoose.Model {


};

schema.loadClass(Users);

module.exports = mongoose.model('Users', schema);