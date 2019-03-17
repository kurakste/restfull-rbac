import { Person } from './interfaces/person'

function greet(person: Person) {
    return "Hello, " + person.firstName;
}

const user = { firstName: 'Helen', lastName: 'Hreber' };
console.log(greet(user));
