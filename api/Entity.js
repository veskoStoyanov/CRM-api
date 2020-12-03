const passport = require('passport');
const T = require('../core/Tools');
const EM = require('../core/EntityMan');

const createEntity = async (req, res, next) => {
    let entity = null;
    const { type } = req.body
    try {
        let system = await EM.getEntityByData({ system: true }, type);
        if (!system) {
            entity = await EM.createEntity({ system: true, name: 'SETUP' }, type);
        } else {
            const defaultData = {
                system: false,
                fields: system.fields
            }

            entity = await EM.createEntity(defaultData, type);
        }
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
        entity = await EM.getEntityById(id, type)
            .populate('fields');
    } catch (e) {
        console.log(e);
        return res.status(400).json({ success: false, errors: [''] });
    }

    return res.status(200).json({ success: true, entity });
};

const deleteEntity = async (req, res) => {
    const { id, type } = req.params;
    try {
      await EM.deleteEntity(id, type);
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
    deleteEntity
};