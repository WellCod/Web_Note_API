var express = require('express')
var router = express.Router()
const Note = require('../models/notes')
const WithAuth = require('../middlewares/auth')


//Criando nova nota e ligando ao usuario
router.post('/', WithAuth, async (req, res) => {
    const { title, body } = req.body

    try {
        let note = new Note({ title: title, body: body, author: req.user._id })
        await note.save()
        res.status(200).json(note)
    } catch (error) {
        res.status(500).json({ error: 'Problem to create a new note !' })
    }
})

// // Buscar uma Nota especifica
router.get('/search', WithAuth, async(req, res) => {
    const { query } = req.query
    try {
        let notes = await Note.find({ author: req.user._id}).find({ $text: {$search: query}})
        res.json(notes)
    } catch (error) {
        res.json({error: error}).status(500)
    }
})


// Retorna a Nota pelo ID
router.get('/:id', WithAuth, async (req, res) => {
    try {
        const { id } = req.params
        let note = await Note.findById(id)
        if (isOwner(req.user, note))
            res.json(note)
        else
            res.status(403).json({ error: 'Permission denied' })
    } catch (error) {
        res.status(500).json({ error: 'Problem to get a note' })
    }
})

// Retorna todas as notas do Usuario utilizando o ID
router.get('/', WithAuth, async (req, res) => {
    try {
        let notes = await Note.find({ author: req.user._id })
        res.json(notes)
    } catch (error) {
        res.status(500).json({ error: 'Problem to get a note' })
    }
})


// Atualiza uma nota especifica utilizando o ID
router.put('/:id', WithAuth, async (req, res) => {
    const { title, body } = req.body
    const { id } = req.params

    try {
        let note = await Note.findById(id)
        if (isOwner(req.user, note)) {
            let note = await Note.findOneAndUpdate(id, { $set: { title: title, body: body } }, { upsert: true, 'new': true })
            res.json(note)
        } else
            res.status(403).json({ error: 'Permission denied' })
    } catch (error) {
        res.status(500).json({ error: 'Problem to update a note' })
    }
})


// Deleta uma nota especifica pelo ID
router.delete('/:id', WithAuth, async (req, res) => {
    const { id } = req.params
    try {
        let note = await Note.findById(id)

        if (isOwner(req.user, note)) {
            await note.delete()
            res.json({ menssage: 'ok' }).status(204)
        } else
            res.status(403).json({ error: 'Permission denied' })
    } catch (error) {
        res.status(500).json({ error: 'Problem to delete a note' })
    }
})



// Verifica pelo ID se o usuario é o dono da nota 
const isOwner = (user, note) => {
    if (JSON.stringify(user._id) == JSON.stringify(note.author._id))
        return true
    else
        return false
}

module.exports = router