const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser')
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');


//ROUTE 1 : GET THE NOTES : GET ""
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user })
        res.json(notes)
    } catch (error) {
        //if error
        console.log(error.message);
        res.status(500).send("Some error occurred: " + error.message)
    }

})



//ROUTE 2: add a new note using post  : POST =>Login required
router.post('/addnote', fetchuser, [
    body('title', "enter valid title!!!").isLength({ min: 3 }),
    body('description', "description must be at least 5 characters!!!").isLength({ min: 5 }),
], async (req, res) => {

    try {
        //destructuring
        const { title, description, tag } = req.body;
        //if theire are error ,return bad request and the error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Note({
            title, description, tag, user: req.user

        })

        const savedNote = await note.save()
        res.json(savedNote)
        console.log(req.user)

    } catch (error) {

        //if error
        console.log(error.message);
        res.status(500).send("Some error occurred: " + error.message)
    }

})




//ROUTE 3: Update existing Note  : PUT =>Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        //create a newnote object for the
        const newNote = {};
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        //Find the note to be updated and update it 
        let note = await Note.findById(req.params.id)
        if (!note) { res.status(404).send("Not Found!!!") }
        if (note.user.toString() !== req.user) {
            return res.status(401).send("Not Allowed!!!")
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })
    } catch (error) {
        //if error
        console.log(error.message);
        res.status(500).send("Some error occurred: " + error.message)
    }

})




//ROUTE 4: Delete existing Note  : DELETE =>Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {

        //Find the note to be deleted and delete it 
        let note = await Note.findById(req.params.id)
        if (!note) { res.status(404).send("Not Found!!!") }
        if (note.user.toString() !== req.user) {
            return res.status(401).send("Not Allowed!!!")
        }


        //allow deletion only if user own this Note
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has beed Deleted!!!" })
    } catch (error) {
        //if error
        console.log(error.message);
        res.status(500).send("Some error occurred: " + error.message)

    }


})

module.exports = router;