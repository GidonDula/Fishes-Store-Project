var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

const { DBUser } = require("../DB/dBUser");

const passport = require('passport');
const { isAuth } = require('../middleware/auth');

const generatePassword = require("../Utils/generatePassword");
const jwt = require('jsonwebtoken');

const secretTokenKey = "D4rf%6&hfdsfbDxnhy54d4h8kgdw23mm";

require('../middleware/passport');

//User Routes
//DBUser = new DBUser();


//sign-up
//login
router.post("/login", passport.authenticate('local'), (req, res, next) => {
    const { user, err } = req;

    if (req.isAuthenticated()) {
        console.log("the user isAuthenticated" + user);
        DBUser.updateLoggedIn(user._id);



        console.log("Creating a new token");
        console.log(user._id);
        // console.log(dotenv.JWT_SECRET);

        let token = jwt.sign({ userId: user._id }, secretTokenKey, { expiresIn: '2h' })
        console.log(token);
        res.json({ staus: true, user: user, token: token });
    } else {
        console.log("the authentication failed" + err);
        res.json({ status: false, message: "login failed" });
        res.redirect('/login');
    }


});


router.get("/login-failure", (req, res, next) => {
    res.send("<div>ERROR</div>")
});


router.post("/sign_up", function(req, res) {
    let fname = req.body.fname;
    let lname = req.body.lname;
    let email = req.body.email;
    let pass = req.body.password;
    let phone = req.body.phone;

    let address = req.body.address;
    let ZipCode = req.body.ZipCode;
    let ImageUrl = req.body.Image;

    console.log(req.body)
    let { salt, hash } = generatePassword(pass);

    let Role = req.body.Role;

    DBUser.insertUser(fname, lname, email, phone, address, ZipCode, ImageUrl, Role, salt, hash);



    return res.status(200).json({ status: true });
});


router.get('/getAllUseres', isAuth, (req, res) => {

    DBUser.getAll()
        .then((Users) => {

            res.json(Users);
        })
        .catch(err => console.log(err));


});




router.delete('/deleteUser/:Id', isAuth, (req, res) => {
    let { Id } = req.params;

    let result = DBUser.deleteById(Id);
    console.log('result:', result);
    result
        .then(data => res.json({ sucsses: data }))
        .catch((err) => console.log(err));
});

router.patch('/UpdateUser/:Id', isAuth, (req, res) => {
    let { Id } = req.params;

    let data = req.body;
    DBUser.updateById(Id, data);

    return res.status(200).json({ status: true });
});

router.patch('/UpdateLoggedOut/:Id', (req, res) => {
    let { Id } = req.params;

    DBUser.updateLoggedOut(Id);


    return res.status(200).json({ status: true });

});

DBUser.createguestSchema();

router.post('/guestMessage', (req, res) => {
    let companyEmail = req.body.companyEmail;
    let fname = req.body.fname;
    let lname = req.body.lname;
    let phone = req.body.phone;
    let companyPhone = req.body.companyPhone;
    let guestMessage = req.body.guestMessage;

    console.log(companyEmail, fname, lname, phone, companyPhone, guestMessage);

    DBUser.insertGuestMessage(companyEmail, fname, lname, phone, companyPhone, guestMessage);

    return res.status(200).json({ status: true });

})


DBUser.createMessegesSchema();

router.post('/newMessage', isAuth, (req, res) => {
    let userA = req.body.userA;
    let userB = req.body.userB;
    let message = req.body.message;
    let time = req.body.time;

    DBUser.insertMessage(userA, userB, message, time);

    return res.status(200).json({ status: true });
});

router.get('/getMessagesForSender/:User', isAuth, (req, res) => {
    let { User } = req.params;
    DBUser.getMessegesForUserA(User)
        .then((messages) => {
            res.json(messages);
        })
        .catch(err => console.log(err))
})

router.get('/getMessagesForResiver/:User', isAuth, (req, res) => {
    let { User } = req.params;
    DBUser.getMessegesForUserB(User)
        .then((messages) => {
            res.json(messages);
        })
        .catch(err => console.log(err))
})

router.delete('/deleteMessagesForSender/:User', isAuth, (req, res) => {
    let { User } = req.params;
    let result = DBUser.deleteAllMessagesForUserA(User);
    console.log(result);
    result.then(data => res.json({ sucsses: data }))
        .catch(err => console.log(err));
})

router.delete('/deleteMessagesForResiver/:User', isAuth, (req, res) => {
    let { User } = req.params;
    let result = DBUser.deleteAllMessagesForUserB(User);
    console.log(result);
    result.then(data => res.json({ sucsses: data }))
        .catch(err => console.log(err));
})
router.get('/success', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>');
    } else {
        res.send('<h1>You are not authenticated</h1><p><a href="/login">Login</a></p>');
    }
    // res.send(`<div>${req.params.userId}</div>`)
})
router.get('/success/:userId', (req, res) => {
    res.send(`<div>${req.params.userId}</div>`)
})






module.exports = router;