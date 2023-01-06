// imports fs so we can write to files
const fs = require('fs');
// npm package to generate unique ids
const { v4: uuid } = require('uuid');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3000;
const app = express();

// creating express server
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// GET route for the notes.htm
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// GET route that reads the db.json file
app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received to get notes`);
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      res.send(data);
    }
  });
});

// POST request that reads the db.json file, then uses fs to add the new note, and write it to the file
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };
// reads the json file
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNote);
// writes to the json file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Notes were successfully updated!')
        );
      }
    });
    
// The response for posting the note, either success or error
    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error writing new note');
  }
});

// GET route for the index
app.get('*', (req, res) => {
  console.log('home');
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// runs the server and displays message in console with link to page
app.listen(PORT, () => console.log(`App listening on port http://localhost:${PORT}`));
