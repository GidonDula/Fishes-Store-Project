const mongoose = require("mongoose");
let db;
const mongodb = require('mongodb');
const ObjectID = require('mongodb').ObjectID;

MONGO_URI = 'mongodb://localhost:27017/FreshWaterFishesDB'

//MONGO_URI = 'mongodb://127.0.0.1:27017/FreshWaterFishesDB'

class DBProduct {
    createSchema() {
        const { Schema } = mongoose;
        this.connection = mongoose.createConnection(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const ProductsSchema = new Schema({
            Name: {
                type: String,
                required: true,
                unique: true,
            },
            Quantity: Number,
            price: Number,


            ImageUrl: String,
            dateAdded: Date,

        });


        this.Products = mongoose.model('Products1', ProductsSchema);

        console.log(this.Products);

        this.connection.on("error", console.log.bind(console, "connection error"));
        this.connection.once("open", function(callback) {
            console.log("connection succeeded");
        });
    }

    insertProduct(name, quantity, price, Image) {
        let dateAdded = new Date();
        var data = {
            name: name,
            quantity: quantity,
            price: price,
            Image: Image,
            dateAdded: dateAdded
        };
        console.log(data);
        this.connection.collection("Products").insertOne(data, function(err, collection) {
            if (err) throw err;
            console.log("Record inserted Successfully");
        });
    }

    getAll() {


        // return promise
        return this.connection.collection('Products')
            .find() // find all products
            .toArray(); // 




    }

    deleteById(id) {
        console.log('deleteById:' + id);
        return this.connection.collection('Products').deleteOne({ _id: new mongodb.ObjectID(id) });
    }

    updatebyId(id, Product) {

        this.connection.collection('Products').updateOne({ _id: new mongodb.ObjectID(id) }, {
            $set: {
                name: Product.name,
                quantity: Product.quantity,
                price: Product.price,
                Image: Product.ImageUrl
            }
        }, function(err, collection) {
            if (err) throw err;
            console.log("Record" + id + " updated Successfully");

        });

    }





}

module.exports = { DBProduct: new DBProduct() }