const mongoose = require('mongoose')
const Schema = mongoose.Schema; 

const ecommerceSchema = new Schema({
    nameCommerce: {
        type: String,
        require: true,
        unique: true
    },
    descriptionCommerce: {
        type: String,
        require: true
    },
    typeCommerce: {
        type: String,
        require: true
    },
    lastUpdate: {
        type: String,
        require: true
    },
    urlPhoto: {
        type: String,
        require: true
    },
    user: {
        type: String,
        require: true
    }
});

const newEcommerce = mongoose.model('All_Ecommerces', ecommerceSchema)

module.exports = newEcommerce