const models = require('../models');
const Field = models.Field
const Handler = {
    async bindField({
        fieldId,
        entityId,
        type
    }) {
        type = type[0].toUpperCase() + type.slice(1);
        let model = models[type].findById(entityId);
        const item = await model;

        if (item.fields.includes(fieldId)) { return entity; }

        item.fields.push(fieldId);
        await item.save();

        return model.populate('fields');
    }
};

module.exports = Handler;