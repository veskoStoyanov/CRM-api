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
    fields: [{
        type: 'ObjectId',
        ref: 'Field',
        default: []
    }],
    contact: {
        type: 'ObjectId',
        ref: 'Contact',
    },
    system: Boolean
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;