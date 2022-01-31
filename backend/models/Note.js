//mongoose - bhai apna app chalao db management mai manage karunga


const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
    //associate user with notes no other user should access another users notes
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'

    },
    title: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        default: "General"

    },

    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

//how to use it ??export it
// we use it in Routes

module.exports = mongoose.model('notes', NotesSchema)
//'notes' = model name 