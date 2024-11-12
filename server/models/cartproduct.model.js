import mongoose from 'mongoose'


const cartSchema = new mongoose.Schema({
    productId : {
        type : mongoose.Schema.ObjectId,
        ref : 'product',
        default : ""
    },

    quantity :{
        type : Number,
        default : 1
    },
    userId : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        default : ""
    },

},{
    timestamps: true,
})


const CartModel = new mongoose.model('cart', cartSchema)

export default CartModel