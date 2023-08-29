const mongoose =require ('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');
const  Schema = mongoose.Schema

const UserSchema = new Schema({
    email:{
        
        type:String,
        required:true,
        uniqe:true
    }

})
// to enhance methods in 'passport-local-mongoose' like password email checking
UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User',UserSchema)

