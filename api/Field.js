const FM = require('../core/FieldMan');
const EM = require('../core/EntityMan');
const fieldMod = 'field';
const fieldOrderMod = 'fieldOrder'

const addField = async (req, res) => {
    let fields = null;
    const { entity, ...rest } = req.body;
    try {
        const field = await EM.createEntity(fieldMod, rest);
        const fieldOrder = await EM.getEntityByData(fieldOrderMod, { entity })
            .populate('fields');

        fieldOrder.fields.push(field);
        fields = fieldOrder.fields;
        await fieldOrder.save();
    } catch (e) {
        console.log(e);
        return res.status(400).json({ success: false, errors: [''] });
    }

    return res.status(200).json({ success: true, fields });
};

const getFields = async (req, res) => {
    let fields = null;
    const { type } = req.params;
    try {
        let fieldOrder = await EM.getEntityByData(fieldOrderMod, { entity: type })
            .populate('fields');

        if (!fieldOrder) {
            fieldOrder = await EM.createEntity(fieldOrderMod, { entity: type });
        }

        fields = fieldOrder.fields;
    } catch (e) {
        console.log(e);
        return res.status(400).json({ success: false, errors: [''] });
    }

    return res.status(200).json({ success: true, fields });
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
    const { name, type } = req.body;
    let field = null;
    try {
        field = await await EM.getEntityById(fieldMod, id);

        if (field.name !== name || field.type !== type) {
            field.name = name;
            field.type = type
        } else {
            return res.status(200).json({ success: true, updatedField: field });
        }

        await field.save();
    } catch (e) {
        console.log(e);
        return res.status(400).json({ success: false, errors: [''] });
    }

    return res.status(200).json({ success: true, updatedField: field });
};

const moveField = async (req, res, next) => {
    let fields = null;
    const {
        entity,
        sourceIndex,
        destinationIndex
    } = req.body;

    try {
        fieldOrder = await EM.getEntityByData(fieldOrderMod, { entity })
            .populate('fields');

        const field = fieldOrder.fields.splice(sourceIndex, 1)[0];
        fieldOrder.fields.splice(destinationIndex, 0, field);
        fields = fieldOrder.fields;
        await fieldOrder.save();
    } catch (e) {
        console.log(e);
    }

    return res.status(200).json({ success: true, fields });
};

const deleteField = async (req, res) => {
    const { id, type } = req.params;
    let fields = null;
    try {
        const fieldOrder = await EM.getEntityByData(fieldOrderMod, { entity: type })  
        fieldOrder.fields = fieldOrder.fields.filter(x => x.toString() !== id.toString());
        await fieldOrder.save();
        await EM.deleteEntity(fieldMod, id);
    } catch (e) {
        console.log(e);
    }

    return res.status(200).json({ success: true});
};

module.exports = {
    addField,
    bindField,
    updateField,
    moveField,
    getFields,
    deleteField
}