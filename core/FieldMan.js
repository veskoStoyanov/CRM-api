const models = require('../models');
const Field = models.Field
const Handler = {
    async addField({ type, entityId, ...rest }) {
        type = type[0].toUpperCase() + type.slice(1);
        const field = await Field.create(rest);
        const entity = await models[type].findById(entityId);
        entity.fields.push(field._id);
        await entity.save();
        return field;
    },

    getAllFields() {
        return Field.find();
    },

    getFieldById(id) {
        return Field.findById(id)
    },

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

        return model.populate('fields')
    },

    async moveField({
        type,
        entityId,
        sourceIndex,
        destinationIndex
    }) {
        type = type[0].toUpperCase() + type.slice(1);
        const entity = await models[type].findById(entityId)
            .populate('fields');

        const field = entity.fields.splice(sourceIndex, 1)[0];
        entity.fields.splice(destinationIndex, 0, field);

        return entity.save()
    },

    async getBindedFields({entityId, type}) {
        type = type[0].toUpperCase() + type.slice(1);
        const entity = await models[type].findById(entityId)
            .populate('fields');

        const fieldsInfo = await this.getAllFields();

        return fieldsInfo.reduce((acc, curr) => {
            const field = entity.fields.find(x => x.name === curr.name);
            if (!field) {
                acc.push(curr);
            }

            return acc;
        }, [])
    }
};

module.exports = Handler;