const mongoose = require ('mongoose')


//Criando modelo de dados das Notas
let noteSchema = new mongoose.Schema({
    title: String,
    body: String,
    created_at: { type: Date, default: Date.now},
    update_ate: { type: Date, default: Date.now},
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
})

module.exports = mongoose.model('Notes', noteSchema)