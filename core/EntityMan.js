const T = require('./Tools');
const Product = require('../models/Product');
const Contact = require('../models/Contact')

const EntityMan = {
    createEntity(data, type) {
        const Model = T.getModel(type);
        return Model.create(data);
    },

    getEntities(type) {
        const Model = T.getModel(type);
        return Model.find();
    },

    getEntityByData(data, type) {
        const Model = T.getModel(type);
        return Model.findOne(data);
    },

    getEntityById(id, type) {
        const Model = T.getModel(type);
        return Model.findById(id);
    },

    deleteEntity(id, type) {
        return this[`delete${type[0].toUpperCase() + type.slice(1)}`](id, type);
    },

    deleteContact(_id) {
        return Contact.deleteOne({ _id });
    },

    async deletePolicy(id, type) {
        const Policy = T.getModel(type);
        try {
            const policy = await Policy.getById(id);

            const product = await Product.getById(policy.product);
            if (product) {
                const index = product.policies.indexOf(id);
                product.policies.splice(index, 1);
                await product.save();
            }

            const contact = await Contact.getById(policy.contact);
            if (contact) {
                const index = contact.policies.indexOf(id);
                contact.policies.splice(index, 1);
                await contact.save();
            }

            return Policy.deleteOne({ _id: id })
        } catch (e) {
            console.log(e);
        }
    },

    async deleteProduct(id) {
        console.log(id);
        try {
            const product = await Product.getById(id);
            const contact = await Contact.getById(product.contact);

            if (contact) {
                const index = contact.products.indexOf(lead._id);
                contact.products.splice(index, 1);
                await contact.save();
            }

            return Product.deleteOne({ _id: id });
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = EntityMan;