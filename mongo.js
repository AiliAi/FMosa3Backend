const mongoose = require('mongoose');

// eslint-disable-next-line no-undef
if (process.argv.length < 3) {
	console.log('give password as argument');
	// eslint-disable-next-line no-undef
	process.exit(1);
}

// eslint-disable-next-line no-undef
const username = process.env.USERNAME;
// eslint-disable-next-line no-undef
const password = process.argv[2];
// eslint-disable-next-line no-undef
const name = process.argv[3];
// eslint-disable-next-line no-undef
const number = process.argv[4];

const url =
    `mongodb+srv://${username}:${password}@cluster0.01i8j.mongodb.net/phone-app?retryWrites=true&w=majority`;
mongoose.connect(url);


const personSchema = new mongoose.Schema({
	name: String,
	number: Number,
	date: Date
});

const Person = mongoose.model('Person', personSchema);

const person = new Person({
	name: name,
	number: number,
	date: new Date()
});

// eslint-disable-next-line no-undef
if (process.argv.length < 4) {
	Person.find({}).then(result => {
		console.log('Phonebook');
		result.forEach(person => {
			console.log(person.name, person.number);
		});
		mongoose.connection.close();
	});
} else {
	person.save().then(() => {
		console.log(`Added ${name} number ${number} to phonebook`);
		mongoose.connection.close();
	});
}