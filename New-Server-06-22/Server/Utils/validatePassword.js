const crypto = require('crypto');
const bcrypt = require("bcrypt");

function validatePassword(password, hash, salt) {
    const hashVerify = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hashVerify === hash;
}


module.exports = validatePassword;