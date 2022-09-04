const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const mongodb = require('mongodb');


MONGO_URI = 'mongodb://localhost:27017/FreshWaterFishesDB'

//MONGO_URI = 'mongodb://127.0.0.1:27017/FreshWaterFishesDB'


let db;

class DBUser {
    createUserSchema() {
        const { Schema } = mongoose;
        this.connection = mongoose.createConnection(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const UsersSchema = new Schema({
            FirstName: String,
            LastName: String,
            phone: {
                type: String,
                unique: true,
            },
            email: {
                type: String,
                required: 'Require e-mail',
                unique: true,
            },
            address: String,
            ZipCode: String,
            ImageUrl: String,
            role: {
                type: String,
                default: 'Customer',
                enum: ['Customer', 'Admin']
            },
            salt: {
                type: String,
                unique: true,
            },
            hash: {
                type: String,
                unique: true,
            },
            dateAdded: Date,
            online: Boolean
        });




        this.connection.on("error", console.log.bind(console, "connection error"));
        this.connection.once("open", function(callback) {
            console.log("connection succeeded");
        });
    }

    createMessegesSchema() {
        const { Schema } = mongoose;
        this.connection = mongoose.createConnection(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const messegesSchema = new Schema({
            userA: String,
            userB: String,
            message: String,
            time: Date
        });

        this.connection.on("error", console.log.bind(console, "connection error"));
        this.connection.once("open", function(callback) {
            console.log("connection succeeded");
        });
    }




    createguestSchema() {
        const { Schema } = mongoose;
        this.connection = mongoose.createConnection(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const guestSchema = new Schema({

            companyEmail: {
                type: String,
                required: 'Require e-mail',
                unique: true,
            },
            fname: String,
            lname: String,
            phone: {
                type: String,
                unique: true,
            },
            companyPhone: {
                type: String,
                unique: true,
            },
            message: String,
        })
        this.connection.on("error", console.log.bind(console, "connection error"));
        this.connection.once("open", function(callback) {
            console.log("connection succeeded");
        });
    }


    //User Collection
    insertUser(fname, lname, email, phone, address, ZipCode, file, role, salt, hash) {
        let dateAdded = new Date();
        var data = {
            fname: fname,
            lname: lname,
            email: email,
            phone: phone,

            address: address,
            ZipCode: ZipCode,
            file: file,
            role: role,
            salt: salt,
            hash: hash,
            dateAdded: dateAdded,
            online: false
        };
        console.log("salt", salt)
        console.log("hash", hash)

        this.connection.collection("Users").insertOne(data, function(err, collection) {
            if (err) throw err;
            console.log("Record inserted Successfully");
        });
    }


    getAll() {


        // return promise
        return this.connection.collection('Users')
            .find() // find all Users
            .toArray(); // 




    }

    deleteById(id) {
        console.log('deleteById:' + id);
        return this.connection.collection('Users').deleteOne({ _id: new mongodb.ObjectID(id) });
    }


    updateById(id, User) {
        console.log(User);
        this.connection.collection('Users').updateOne({ _id: new mongodb.ObjectID(id) }, {
            $set: {
                email: User.email,
                fname: User.fname,
                lname: User.lname,
                phone: User.phone,
                address: User.address,
                ZipCode: User.ZipCode,
                file: User.photo,
                role: User.role

            }
        }, function(err, collection) {
            if (err) throw err;
            console.log("Record" + id + " updated Successfully");
        });
    }

    updateLoggedIn(id) {
        this.connection.collection('Users').updateOne({ _id: new mongodb.ObjectID(id) }, {
            $set: {
                online: true
            }
        }, function(err, collection) {
            if (err) throw err;
            console.log("Record" + id + " updated Successfully");
        });
    }


    updateLoggedOut(id) {
        this.connection.collection('Users').updateOne({ _id: new mongodb.ObjectID(id) }, {
            $set: {
                online: false
            }
        }, function(err, collection) {
            if (err) throw err;
            console.log("Record" + id + " updated Successfully");
        });
    }


    //Guest Meswsage
    insertGuestMessage(companyEmail, fname, lname, phone, companyPhone, guestMessage) {
        var data = {
            companyEmail: companyEmail,
            fname: fname,
            lname: lname,
            phone: phone,
            companyPhone: companyPhone,
            message: guestMessage
        }

        this.connection.collection('GuestsMessages').insertOne(data, function(err, collection) {
            if (err) console.log(err);
            console.log("Record inserted Sucsessfully");
        });
    }




    //MessagesCollection 
    insertMessage(userA, userB, message, time) {
        var data = {
            userA: userA,
            userB: userB,
            message: message,
            time: time
        }
        this.connection.collection("messages").insertOne(data, function(err, collection) {
            if (err) throw err;
            console.log("Record inserted Successfully");
        });
    }

    getMessegesForUserA(User) {
        console.log(User)
        return this.connection.collection("messages").find({ userA: User }).toArray();
    }

    getMessegesForUserB(User) {
        console.log(User)
        return this.connection.collection("messages").find({ userB: User }).toArray();
    }

    deleteAllMessagesForUserA(User) {
        return this.connection.collection('messages').deleteMany({ userA: User })
    }

    deleteAllMessagesForUserB(User) {
        return this.connection.collection('messages').deleteMany({ userB: User })
    }



}

module.exports = { DBUser: new DBUser() }