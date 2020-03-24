//here is where we define what our database should expect from us
const mongoose = require('mongoose');
//schema is how we define what goes into our database
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    "name": String,
    "location": String,
    "email": String,
    "comment": String 

});

const db = mongoose.model('comments', commentSchema);
module.exports = db;