const models = require('../models');
const Field = models.Field
const Handler = {
    async addField ({type, entityId, ...rest}) {
        type = type[0].toUpperCase() + type.slice(1);
        const field = await Field.create(rest);
        const entity = await models[type].findById(entityId);
        entity.fields.push(field._id);
        return entity.save();
    },

    getAllFields() {
        return Field.find();
    },

    async bindField({ fieldId, entityId, type}) {
        type = type[0].toUpperCase() + type.slice(1);
        const entity = await models[type].findById(entityId);

        if (entity.fields.includes(fieldId)) { return entity; }
        
        entity.fields.push(fieldId);
        return entity.save()
    }
};

module.exports = Handler;