const mongoose = require('mongoose');

const schema = mongoose.Schema({
    userId:{
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
 
    rating : Number,
    comments : String,
    liked : Boolean
},{
    versionKey: false,
    timestamps:{
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
}
);

class Outfits extends mongoose.Model {


};

schema.loadClass(Outfits);

module.exports = mongoose.model('Outfits', schema);