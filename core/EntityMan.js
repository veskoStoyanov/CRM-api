const T = require('./Tools');
const models = require('../models');
const defaultRemap = {
    lead: {
        forDelete: 'leads',
        modNames: ['contact', 'product', 'pipe',]
    },
    contact: {
        forDelete: 'contacts',
        modNames: []
    },

    product: {
        forDelete: 'products',
        modNames: [ 'contact' ]
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

    async deleteRef(type, id) {
        const { modNames, forDelete } = defaultRemap[type]
        const entityToBeDelete = await this.getEntityById(type, id);
        const length = modNames.length;
        for (let i = 0; i < length; i++) {
            const refModel = modNames[i];

            if (entityToBeDelete[refModel]) {
                const ferEntity = await this.getEntityById(refModel, entityToBeDelete[refModel]);
                if (ferEntity) {
                    ferEntity[forDelete] = ferEntity[forDelete].filter(x => x.toString() !== entityToBeDelete._id.toString());
                    ferEntity.save();
                }
            }
        }

        return this.deleteEntity(type, id);
    }
}

module.exports = EntityMan;