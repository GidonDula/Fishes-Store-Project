const mongoose = require("mongoose");
let db;
const mongodb = require('mongodb');
const ObjectID = require('mongodb').ObjectID;


MONGO_URI = 'mongodb://localhost:27017/FreshWaterFishesDB'

//MONGO_URI = 'mongodb://127.0.0.1:27017/FreshWaterFishesDB'

class DBOrder {
    createSchema() {
        const { Schema } = mongoose;
        this.connection = mongoose.createConnection(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const OrdersSchema = new Schema({
            ProductId: {
                type: mongodb.ObjectId,
                required: true
            },
            UserId: {
                type: mongodb.ObjectId,
                required: true
            },
            UserEmail: String,
            ProductName: String,

            OrderdQuantity: Number,



            OrderDate: Date,

        });



        this.connection.on("error", console.log.bind(console, "connection error"));
        this.connection.once("open", function(callback) {
            console.log("connection succeeded");
        });
    }

    insertOrder(ProductId, UserId, UserEmail, ProductName, quantity) {
        let OrderDate = new Date();
        var data = {

            ProductId: new mongodb.ObjectID(ProductId),
            UserId: new mongodb.ObjectID(UserId),
            UserEmail: UserEmail,
            ProductName: ProductName,
            OrderdQuantity: quantity,

            OrderDate: OrderDate
        };
        console.log(data);
        this.connection.collection("Orders").insertOne(data, function(err, collection) {
            if (err) throw err;
            console.log("Record inserted Successfully");
        });
    }

    getOrdersByUser(userEmail) {


        return this.connection.collection('Orders')
            .find({ UserEmail: userEmail })
            .toArray();


    }

    getAll() {


        // return promise
        return this.connection.collection('Orders')
            .find() // find all products
            .toArray(); // 




    }

    deleteById(id) {
        console.log('deleteById:' + id);
        return this.connection.collection('Orders').deleteOne({ _id: new mongodb.ObjectID(id) });
    }

    updatebyId(id, Order) {
        console.log(Order);

        this.connection.collection('Orders').updateOne({ _id: new mongodb.ObjectID(id) }, {
            $set: {
                ProductId: Order.ProductId,
                ProductName: Order.ProductName,
                OrderdQuantity: Order.OrderdQuantity,

            }
        }, function(err, collection) {
            if (err) throw err;
            console.log("Record" + id + " updated Successfully");

        });

    }

}



module.exports = { DBOrder: new DBOrder() }