const crypto = require('crypto');

function genPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

    return {
        salt: salt,
        hash: hash
    };
}


module.exports = genPassword;