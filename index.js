const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const requestLogger = require("./requestLogger");

function createId() {
  return Math.floor(Math.random() * 100000).toString();
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan(requestLogger));

let contacts = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
];

app.get("/api/persons", (req, res) => {
  res.json(contacts);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const contact = contacts.find(c => c.id === id);
  if (!contact) {
    return res.status(404).json({ error: "Contact not found" });
  }
  res.json(contact);
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;
  if (!name || !number) {
    return res.status(400).json({ error: "Name and number are required" });
  }

  if (contacts.some(c => c.name === name)) {
    return res.status(400).json({ error: "Name must be unique" });
  }

  const newContact = {
    id: createId(),
    name,
    number
  };

  contacts = contacts.concat(newContact);
  res.status(201).json(newContact);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  contacts = contacts.filter(c => c.id !== id);
  res.status(204).end();
});

app.get("/info", (req, res) => {
  const date = new Date();
  const info = `<p>Phonebook has info for ${contacts.length} people</p>
                <p>${date.toString()}</p>`;
  res.send(info);
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});