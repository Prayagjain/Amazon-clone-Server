const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    id:String,
    url:String,
    detailUrl:String,
    title:Object,
    price:Object,
    description:String,
    discount:String,
    tagline:String
});

module.exports = new mongoose.model("Product",productSchema);