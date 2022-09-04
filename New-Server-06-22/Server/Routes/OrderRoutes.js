var express = require('express');
var router = express.Router();
const { isAuth } = require('../middleware/auth');

const { DBOrder } = require("../DB/dBOrder");

DBOrder.createSchema();

router.post('/addOrder', isAuth, (req, res) => {
    let ProductId = req.body.ProductId;
    let UserId = req.body.UserId;
    let UserEmail = req.body.UserEmail;
    let ProductName = req.body.ProductName;
    let OrderdQuantity = req.body.OrderdQuantity;
    console.log(ProductId, UserId, UserEmail, ProductName, OrderdQuantity);


    DBOrder.insertOrder(ProductId, UserId, UserEmail, ProductName, OrderdQuantity);

    return res.status(200).json({ status: true });

});


router.get('/getOrdersByUser/:UserEmail', isAuth, (req, res) => {
    let { UserEmail } = req.params;

    DBOrder.getOrdersByUser(UserEmail)
        .then((Orders) => {
            console.log(Orders);
            res.json(Orders);
        })
        .catch(err => console.log(err));



})


router.get('/getAllOrders', isAuth, (req, res) => {

    DBOrder.getAll()
        .then((Orders) => {

            res.json(Orders);
        })
        .catch(err => console.log(err));

});

router.delete('/deleteOrderById/:OrderId', isAuth, (req, res) => {
    let { OrderId } = req.params;
    let result = DBOrder.deleteById(OrderId);
    console.log('result:', result);
    result
        .then(data => res.json({ sucsses: data }))
        .catch((err) => console.log(err));
})


router.patch('/updateOrderById/:OrderId', isAuth, (req, res) => {
    let { OrderId } = req.params;

    let data = req.body;
    console.log(data);
    DBOrder.updatebyId(OrderId, data);

    return res.status(200).json({ status: true });

})



module.exports = router;