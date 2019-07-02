const jwt = require('jsonwebtoken');

//Jwt
let payload = {
    _id: 'hello jwt'
};

let secret = '12345678';



let token = jwt.sign(payload, secret);

console.log(token);

let decoded = jwt.verify(token, secret);

console.log(decoded)