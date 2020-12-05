const T = require('./Tools');
const models = require('../models');
const {
    Product,
    Contact,
} = models;

const defaultRemap = {
    lead: {
        forDelete: 'leads',
        modNames: ['contact', 'product', 'pipe',]
    }
}

const EntityMan = {
    getModel(type) {
        return models[type[0].toUpperCase() + type.slice(1)];
    },
    
    createEntity(type, data) {
        const Model = this.getModel(type);
        return Model.create(data);
    },

    getEntities(type) {
        const Model = this.getModel(type);
        return Model.find();
    },

    getEntitiesByData(type, data) {
        const Model = this.getModel(type);
        return Model.find(data);
    },

    getEntityByData(type, data) {
        const Model = this.getModel(type);
        return Model.findOne(data);
    },

    getEntityById(type, id) {
        const Model = this.getModel(type);
        return Model.findById(id);
    },

    deleteEntity(type, _id) {
        const Model = this.getModel(type);
        return Model.deleteOne({ _id });
    },

    async delete(type, id) {
        const { modNames, forDelete } = defaultRemap[type]
        const item = await this.getEntityById(type, id);
        const length = modNames.length;
        for (let i = 0; i < length; i++) {
            const model = modNames[i];

            if (item[model]) {
                const entity = await this.getEntityById(model, item[model]);
                if (entity) {
                    entity[forDelete] = entity[forDelete].filter(x => x.toString() !== item._id.toString());
                    entity.save();
                }
            }
        }

        return this.deleteEntity(type, id);
    }
}

module.exports = EntityMan;