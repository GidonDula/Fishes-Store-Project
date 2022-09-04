var express = require('express');
var router = express.Router();
const { isAuth } = require('../middleware/auth');

const { DBProduct } = require("../DB/dBProduct");

//Product Routes

DBProduct.createSchema();

router.post('/addProduct', isAuth, (req, res) => {
    let name = req.body.name;
    let quantity = req.body.quantity;
    let price = req.body.price;
    let Image = req.body.ImageUrl;
    console.log(name, quantity, price, Image);

    DBProduct.insertProduct(name, quantity, price, Image);

    return res.status(200).json({ status: true });

});

router.get('/getAllProducts', (req, res) => {

    DBProduct.getAll()
        .then((products) => {

            res.json(products);
        })
        .catch(err => console.log(err));

});

router.delete('/deleteProduct/:Id', isAuth, (req, res) => {
    let { Id } = req.params;

    let result = DBProduct.deleteById(Id);
    console.log('result:', result);
    result
        .then(data => res.json({ sucsses: data }))
        .catch((err) => console.log(err));

})

router.patch('/UpdateProduct/:Id', isAuth, (req, res) => {
    let { Id } = req.params;

    let data = req.body;

    console.log(data);

    DBProduct.updatebyId(Id, data);

    return res.status(200).json({ status: true });


})





module.exports = router;