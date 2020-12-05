const FM = require('../core/FieldMan');
const EM = require('../core/EntityMan');
const fieldMod = 'field';

const addField = async (req, res) => {
    let field = null;
    const { type, entityId, ...rest } = req.body;
    try {
        field = await EM.createEntity(fieldMod, rest);
        
        const entity = await EM.getEntityById(type, entityId);
        entity.fields.push(field._id);
        await entity.save();
    } catch (e) {
        console.log(e);
        return res.status(400).json({ success: false, errors: [''] });
    }

    return res.status(200).json({ success: true, field });
};

const bindField = async (req, res) => {
    let entity = null;
    try {
        entity = await await FM.bindField(req.body);
    } catch (e) {
        console.log(e);
        return res.status(400).json({ success: false, errors: [''] });
    }

    return res.status(200).json({ success: true, entity });
};

const updateField = async (req, res) => {
    const { id } = req.params;
    const { fieldId, ...rest } = req.body;
    let field = null;
    try {
        field = await await EM.getEntityById(fieldMod, id);
        Object.keys(rest).forEach(key => {
            field[key] = rest[key]
        });

        await field.save();
    } catch (e) {
        console.log(e);
        return res.status(400).json({ success: false, errors: [''] });
    }

    return res.status(200).json({ success: true, field });
};

const moveField = async (req, res, next) => {
    let entity = null;
    const {
        type,
        entityId,
        sourceIndex,
        destinationIndex
    } = req.body;
    try {
        entity = await EM.getEntityById(type, entityId)
            .populate('fields');

        const field = entity.fields.splice(sourceIndex, 1)[0];
        entity.fields.splice(destinationIndex, 0, field);

        return entity.save()
    } catch (e) {
        console.log(e);
    }

    return res.status(200).json({ success: true, entity });
};

const getBindedFields = async (req, res) => {
    const { entityId, type } = req.params;
    let fields = null;
    try {
        const entity = await EM.getEntityById(type, entityId)
            .populate('fields');
        fields = await EM.getEntities(fieldMod);
        fields = fields.reduce((acc, curr) => {
            const field = entity.fields.find(x => x.name === curr.name);
            if (!field) {
                acc.push(curr);
            }

            return acc;
        }, []);
    } catch (e) {
        console.log(e);
    }

    return res.status(200).json({ success: true, fields });
};

module.exports = {
    addField,
    bindField,
    updateField,
    moveField,
    getBindedFields
}