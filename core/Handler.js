const models = require('../models');
const Field = models.Field
const Handler = {
    async addField ({type, entityId, ...rest}) {
        console.log(type);
        type = type[0].toUpperCase() + type.slice(1);
        const field = await Field.create(rest);
        const entity = await models[type].findById(entityId);
        entity.fields.push(field._id);
        return entity.save();
    }
};

module.exports = Handler;