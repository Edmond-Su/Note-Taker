const notes = require('express').Router();
const { readFromFile, readAndAppend } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');

// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

notes.delete('/:note_id', (req, res) => {
    if (req.params.note_id) {
        console.info(`${req.method} request received for a note`);
        const noteId = req.params.note_id;
        readFromFile('./db/db.json')
            .then((data) => {
                notesDb = JSON.parse(data);
                for (let i = 0; i < notesDb.length; i++) {
                    const currentNote = notesDb[i];
                    if (currentNote.id === noteId) {
                        res.json(currentNote);
                        return;
                    }
                }
                res.status(404).send("Note not found");
            });
    } else {
        res.status(400).send("Note ID not provided")
    }
});

// POST Route for a new UX/UI note
notes.post('/', (req, res) => {
    console.info(`${req.method} request received to add a note`);
    console.log(req.body);

    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };

        readAndAppend(newNote, './db/db.json');
        res.json(`Note added successfully`);
    } else {
        res.error('Error in adding note');
    }
});

module.exports = notes;