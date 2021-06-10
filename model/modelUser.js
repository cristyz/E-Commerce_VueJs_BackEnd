const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema; 

const userSchema = new Schema({
    userName: {
        type: String,
        require: true,
        unique: true
    },
    userPassword: {
        type: String,
        require: true
    },
    userEcommerces: {
        type: Array,
        require: true,
        default: []
    }
});


const newUser = mongoose.model('all_users', userSchema)

module.exports = newUser