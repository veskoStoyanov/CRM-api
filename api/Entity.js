const passport = require('passport');
const T = require('../core/Tools');
const EM = require('../core/EntityMan');
const fieldOrderMod = 'fieldOrder'

const createEntity = async (req, res, next) => {
    let entity = null;
    const { type } = req.body;
    try {
        entity = await EM.createEntity(type, {});
    } catch (e) {
        console.log(e);
        return res.status(400).json({ success: false, errors: [''] });
    }

    return res.status(200).json({ success: true, entity });
};

const getEntities = async (req, res, next) => {
    const { type } = req.params;
    let entities = null;
    try {
        entities = await EM.getEntities(type);
        entities = T.removeProps(entities);
    } catch (e) {
        console.log(e);
        return res.status(400).json({ success: false, errors: [''] });
    }

    return res.status(200).json({ success: true, entities });
};

const getEntity = async (req, res, next) => {
    const { id, type } = req.params;
    let entity = null;
    try {
        const fieldOrder = await EM.getEntityByData(fieldOrderMod, { entity: type })
            .populate('fields');
        entity = await EM.getEntityById(type, id);
        
        if(fieldOrder) {
            const fields = [];
            fieldOrder.fields.forEach(e => {
                const field = entity.fields.find(x => x.name === e.name);
                fields.push({
                    name: e.name,
                    value: field ? field.value : null
                });
            });
    
            entity.fields = fields;
            entity.markModified('fields');
            entity.save();
        }
    } catch (e) {
        console.log(e);
        return res.status(400).json({ success: false, errors: [''] });
    }

    return res.status(200).json({ success: true, entity });
};

const updateEntity = async (req, res) => {
    const { id } = req.params;
    const { name, value, type } = req.body;
    let entity = null;

    try {
        entity = await EM.getEntityById(type, id);
        entity.fields.forEach(x => {
            if (x.name === name) {
                x.value = value;
            }
        });

        entity.markModified('fields');
        await entity.save();
    } catch (e) {
        console.log(e);
        return res.status(400).json({ success: false, errors: [''] });
    }

    return res.status(200).json({ success: true, entity });
};

const deleteEntity = async (req, res) => {
    const { id, type } = req.params;
    try {
        await EM.deleteRef(type, id);
    } catch (e) {
        console.log(e);
        return res.status(400).json({ success: false, errors: [''] });
    }

    return res.status(200).json({ success: true });
};

module.exports = {
    getEntities,
    createEntity,
    getEntity,
    deleteEntity,
    updateEntity
};