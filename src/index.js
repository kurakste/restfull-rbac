"use strict";
exports.__esModule = true;
function greet(person) {
    return "Hello, " + person.firstName;
}
var user = { firstName: 'Helen', lastName: 'Hreber' };
console.log(greet(user));
