import react from 'react';
import React, { useState } from 'react';

import NoteContext from './noteContext';

const NoteState = (props) => {
    const host = "http://localhost:5000"
    const notesInitial = []
    const [notes, setNotes] = useState(notesInitial);


    //Add Notes .
    const addNote = async (title, description, tag) => {
        //todo :APICALL
        //API CALL to


        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjFmNGUwNTg0NThlZjNhMTAxYzcxM2NmIiwiaWF0IjoxNjQzNDQ0MDkzfQ.1e37xe3RzgSxiR_bTScDAH67fdGhVyR_cTproZU7-34"
            },
            body: JSON.stringify({ title, description, tag })
        });
        const json = response.json();
        console.log("Adding a new note!!!");

        const note = {
            "_id": "61f52ab37166ac4f16b1x190b",
            "user": "61f4e058458ef3a101c713cf",
            "title": title,
            "tag": tag,
            "description": description,
            "date": "2022-01-29T11:50:54.470Z",
            "__v": 0
        };
        setNotes(notes.concat(note))
    }
    // getting error  use concat here instead of push



    //Add all notes .
    const getNotes = async () => {

        //API CALL 

        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjFmNGUwNTg0NThlZjNhMTAxYzcxM2NmIiwiaWF0IjoxNjQzNDQ0MDkzfQ.1e37xe3RzgSxiR_bTScDAH67fdGhVyR_cTproZU7-34"
            },

        });
        const json = await response.json();
        console.log(json);
        setNotes(json)
    }
    // getting error  use concat here instead of push




    //Delete Notes 
    const deleteNote = async (id) => {
        //api call
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjFmNGUwNTg0NThlZjNhMTAxYzcxM2NmIiwiaWF0IjoxNjQzNDQ0MDkzfQ.1e37xe3RzgSxiR_bTScDAH67fdGhVyR_cTproZU7-34"
            }

        });
        const json = response.json();
        console.log(json);
        setNotes(json)

        console.log("deleting note with id!!!" + id)
        const newNotes = notes.filter((note) => {
            return note._id !== id
        })
        setNotes(newNotes);
        getNotes()

    }




    //Edit Note
    const editNote = async (id, title, description, tag) => {
        //API CALL to


        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjFmNGUwNTg0NThlZjNhMTAxYzcxM2NmIiwiaWF0IjoxNjQzNDQ0MDkzfQ.1e37xe3RzgSxiR_bTScDAH67fdGhVyR_cTproZU7-34"
            },
            body: JSON.stringify({ title, description, tag })
        });
        const json = response.json();


        //LOGIC TO EDIT IN CLIENT
        for (let index = 0; index < notes.length; index++) {
            const element = notes[index];
            if (element._id === id) {
                element.title = title;
                element.description = description;
                element.tag = tag;
            }
        }
    }


    return (
        <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;