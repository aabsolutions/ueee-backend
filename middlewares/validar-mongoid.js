const mongoose = require('mongoose');
 
const validarMongoID = (mongoid) => {
    return mongoose.Types.ObjectId.isValid(mongoid);
}
 
module.exports = {
    validarMongoID
}