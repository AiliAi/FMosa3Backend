const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('give password as argument');
    process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url =
    `mongodb+srv://MongoAiliAi:${password}@cluster0.01i8j.mongodb.net/phone-app?retryWrites=true&w=majority`
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

if (process.argv.length < 4) {
    Person.find({}).then(result => {
        console.log('Phonebook');
        result.forEach(person => {
            console.log(person.name, person.number);
        })
        mongoose.connection.close();
    })
} else {
    person.save().then(result => {
        console.log(`Added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
    })
}