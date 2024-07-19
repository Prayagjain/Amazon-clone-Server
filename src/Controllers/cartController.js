
const cartModel = require("../models/cartModel")
const productModel = require("../models/productModel")
const userModel = require("../models/userModel")
const { validateRequest, validateObjectId } = require("../validator/validations") 


//=====================================CREATING CART===========================================================//

let createCart = async function (req, res) {
    try {
        let id = req.decodedToken._id
        let productId = req.params.id

        let cart = await cartModel.findOne({ userId: id })
        if (!cart) {
            let obj = {
                "userId": id,
                "items": [{
                    "productId": productId,
                    "quantity": 1
                }]
            }
            let cartCreated = await cartModel.create(obj)
            res.status(200).send({ status: true, message: "F-Item added successfully", data: cartCreated })
        }
        else {
            let noProductId = true
            for (let i = 0; i < cart.items.length; i++) {
                if (cart.items[i].productId == productId) {
                    if(cart.items[i].quantity>=5)return res.status(400).send({status:false,message:"you reach to max limit of 5"})
                    cart.items[i].quantity++
                    noProductId = false
                }
            }
            if (noProductId) {
                let obj = {}
                obj.productId = productId
                obj.quantity = 1
                cart.items.push(obj)
            }

            let newCart = await cart.save()
            res.status(200).send({ status: true, message: "Item added successfully", data: newCart })
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ sttus: false, message: err.message })
    }

}


//=====================================UPDATING CART===========================================================//


let updateCart = async function (req, res) {
    try {
        let userId = req.decodedToken._id
        let productId = req.body.data
        let value = req.body.value

        let cart = await cartModel.findOne({ userId: userId })
        if (!cart) { return res.status(404).send({ status: false, message: "cart with this userId not found" }) }

        for (let i = 0; i < cart.items.length; i++) {
            if (cart.items[i].productId == productId) {
                cart.items[i].quantity=value
                break;
            }
        }
        let updated = await cart.save()
        res.status(200).send(updated)
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ sttus: false, message: err.message })
    }
}



//=====================================GETTING CART BY USERID===================================================//



let getCart = async function (req, res) {
    try {
        let userId = req.decodedToken._id

        let cart = await cartModel.findOne({ userId: userId }).populate(['userId', 'items.productId'])
        if (!cart) { return res.status(404).send({ status: false, message: "cart with this userId not found" }) }

        res.status(200).send({ status: true, data: cart })
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message })
    }
}


//=====================================DELETING CART===========================================================//


let deleteProductFromCart = async function (req, res) {
    try {
        let userId = req.decodedToken._id
        let productId = req.body.data

        let cart = await cartModel.findOne({ userId: userId })
        if (!cart) { return res.status(404).send({ status: false, message: "cart with this userId not found" }) }

        for (let i = 0; i < cart.items.length; i++) {
            if (cart.items[i].productId == productId) {
                cart.items.splice(i, 1)
            }
        }

        let newCart = await cart.save()
        res.status(201).send({ status: true, data: newCart })
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createCart, updateCart, getCart, deleteProductFromCart }
