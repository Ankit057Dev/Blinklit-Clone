import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

    name : {
        type : String,
    },
    image : {
        type: Array,
        default : []

    },
    category :[
        {
        type : mongoose.Schema.ObjectId,
        ref : 'category'
        },

    ],
    subCategory : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'subCategory'

        }
    ],

    unit : {
        type : String ,
        default : ""
    },
    stock : { 
        type : Number,
        defaut : null
    },
    price : { 
        type : Number,
        default : null
    },
    discount :{

        type : Number,
        default : null

    },
    description :{
        type : String,
        default : ""
    },
    more_details : {
        type : Object,
        default : {}
    },
    publish :{
        type : Boolean,
        default : true
    }


     



},{
    timestamps : true
})



const ProductModel = mongoose.Model('product',productSchema)
export default ProductModel