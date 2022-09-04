const passport = require('passport');
const { Strategy } = require('passport-local');
const bcrypt = require('bcrypt');
const { DBUser } = require('../DB/dBUser');
const jsonwebtoken = require('jsonwebtoken');
const dotenv = require('dotenv');
const validatePassword = require("../Utils/validatePassword");
dotenv.config();

const verifyCallback = (email, password, done) => {
    DBUser.connection.collection("Users").findOne({ email: email })
        .then((user) => {
            if (!user) { return done(null, false) }
            console.log(user)
            const isValid = validatePassword(password, user.hash, user.salt);

            if (isValid) {
                console.log("the valid User is", user);
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch((err) => {
            done(err);
        });
}
const customFields = {
    usernameField: 'email',
    passwordField: 'password'
};


const strategy = new Strategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, String(user._id));
});

passport.deserializeUser((user, done) => {
    DBUser.connection.collection("Users").findOne({ _id: user })
        .then((user) => {
            console.log("IM here")
            done(null, user);
        })
        .catch(err => done(err))
});