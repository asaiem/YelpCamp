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
// to enhance method in 'passport-local-mongoose'
UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User',UserSchema)

