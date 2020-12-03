const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'New Product',
    },
    leads: [{
        type: 'ObjectId',
        ref: 'Lead',
        default: []
    }],
    policies: [{
        type: 'ObjectId',
        ref: 'Policy',
        default: []
    }],
    contact: {
        type: 'ObjectId',
        ref: 'Contact'
    },
    fields: [{
        type: 'ObjectId',
        ref: 'Field',
        default: []
    }],
    system: Boolean
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;