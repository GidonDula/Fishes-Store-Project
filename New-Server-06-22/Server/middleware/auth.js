const jwt = require('jsonwebtoken');
const secretTokenKey = "D4rf%6&hfdsfbDxnhy54d4h8kgdw23mm";

const isAuth = (req, res, next) => {
    //  console.log(req.cookies);
    // get the token from the client
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    // console.log("Headers" + req.headers['authorization']);
    //const token = req.headers['authorization'];
    //console.log("auth" + token);
    // console.log('authHeader', req.headers);
    //fetch the token from 'authHeader'
    const token = authHeader && authHeader.split(' ')[1]; // Bearer fdsfsd3.23234.2423423
    console.log(authHeader.split(' ')[1]);
    console.log(token);
    if (!token || token === 'null') {
        console.log('token not exist');
        return res.sendStatus(401); // there is no token
    }
    // verify the token
    console.log("verifying token" + token);
    jwt.verify(token, secretTokenKey, (err, user) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403); // the token is no longer valid
        }
        // add user object to request
        req.user = user;
        next();
    });
}

module.exports = {
    isAuth
}