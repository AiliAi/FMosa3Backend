const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
//app.use(morgan('tiny'))

morgan.token('bodyJSON', (req, res) => JSON.stringify(req.body || {}));

const log = morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.bodyJSON(req, res)
    ].join(' ');
});

app.use(log);

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
];


app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
});

//<p>${new Date("October 13, 2014 11:13:00")}</p></div>
app.get('/info', (req, res) => {
    res.send(`<div><p>Phonebook has info for ${persons.length} persons</p><p>${new Date()}</p></div>`);
});

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

const generateId = () => {
    return Math.floor(Math.random() * 10000)
};

app.post('/api/persons', (request, response) => {
    const body = request.body;

    //if there is no name or number
    if (!body.name && !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
        //if name already exists in the list
    } else if (persons.find(person => person.name === body.name)) {
        return response.status(409).json({
            error: 'name must be unique'
        });
    }

    const person = {
        name: body.name,
        number: body.number,
        date: new Date(),
        id: generateId(),
    }

    persons = persons.concat(person);

    response.json(person);
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})