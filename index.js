require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
const app = express();

app.use(express.static('build'));
app.use(cors());
app.use(express.json());
//app.use(morgan('tiny'))

morgan.token('bodyJSON', (req) => JSON.stringify(req.body || {}));

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

app.get('/', (req, res) => {
	res.send('<h1>Hello World!</h1>');
});

app.get('/info', (req, res) => {
	res.send(`<div><p>Phonebook has info for ${Person.length} persons</p><p>${new Date()}</p></div>`);
});

app.get('/api/persons', (request, response) => {
	Person.find({}).then(people => {
		response.json(people);
	});
});

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id)
		.then(person => {
			if (person) {
				response.json(person);
			} else {
				response.status(404).end();
			}
		})
		.catch(error => next(error));
});

app.post('/api/persons', (request, response, next) => {
	const body = request.body;

	const person = new Person({
		name: body.name,
		number: body.number,
		date: new Date(),
	});

	person
		.save()
		.then(savedPerson => savedPerson.toJSON())
		.then(savedAndFormattedPerson => {
			response.json(savedAndFormattedPerson);
		})
		.catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body;

	const person = {
		name: body.name,
		number: body.number,
	};

	Person.findByIdAndUpdate(request.params.id, person, { new: true })
		.then(updatedPerson => {
			response.json(updatedPerson);
		})
		.catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
		.then(() => {
			response.status(204).end();
		})
		.catch(error => next(error));
});

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' });
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message });
	}

	next(error);
};

app.use(errorHandler);

// eslint-disable-next-line no-undef
const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});