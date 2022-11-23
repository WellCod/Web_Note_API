const mongoose = require ('mongoose')
const bcrypt = require('bcrypt')


//Criando modelo de dados dos Usuarios
let userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    created_at: { type: Date, default: Date.now},
    update_ate: { type: Date, default: Date.now},
})

//Transforma a senha em uma hash
userSchema.pre('save', function(next){
    if (this.isNew || this.isModified('password')) {       
        bcrypt.hash(this.password, 10, (err, hasgedPassword) => {
            if (err)
                next(err)
            else{
                this.password = hasgedPassword
                next()
            }
        })
    }
})

userSchema.methods.isCorrectPassword = function (password, callback) {
    bcrypt.compare(password, this.password, function(err, same){
        if(err)
            callback(err)
        else
            callback(err, same)
    })
}

module.exports = mongoose.model('User', userSchema)