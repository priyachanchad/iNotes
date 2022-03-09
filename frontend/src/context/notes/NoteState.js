import React, { useState } from "react";
import NoteContext from "./noteContext";

const NoteState =(props)=>{
  const host = "http://localhost:5000"
    const notesInitial = []

      const [notes, setNotes] = useState(notesInitial);

      //Get all notes
      const getNotes = async ()=> {
        //API Call
        const response = await fetch(`${host}/api/note/fetchallnotes`, {
          method: 'GET', 
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token'),
          },
        });
        const json = await response.json()
        // console.log(json)
        setNotes(json)
      }


      //Add note
      const addNote = async (title, description, tag)=> {
        //API Call
        const response = await fetch(`${host}/api/note/addnote`, {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token'),
          },
          body: JSON.stringify({title, description, tag}) 
        });
        
        const note = await response.json()
        setNotes(notes.concat(note))
        
      }

      // Delete note
      const deleteNote = async (id)=>{
         //API Call
         const response = await fetch(`${host}/api/note/deletenote/${id}`, {
          method: 'DELETE', 
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token'),
          },
        });
        const json = await response.json();
        console.log(json)
        const newNotes = notes.filter((note)=>{return note._id!==id})
        setNotes(newNotes)
      }

      // Edit note
      const editNote = async (id, title, description, tag)=>{

        //API Call
        const response = await fetch(`${host}/api/note/updatenote/${id}`, {
          method: 'PUT', 
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token'),
          },
          body: JSON.stringify({title, description, tag}) 
        });
        const json = await response.json();
        console.log(json);
        
        //Logic to edit icon
        let newNotes = JSON.parse(JSON.stringify(notes))
        for (let index = 0; index < notes.length; index++) {
          const element = newNotes[index];
          if (element._id === id) {
            newNotes[index].description = description;
            newNotes[index].tag = tag;
            newNotes[index].title = title;
            break;
          }
        }
        setNotes(newNotes)
      }
    return (
        <NoteContext.Provider value={{notes, addNote, deleteNote, editNote, getNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;