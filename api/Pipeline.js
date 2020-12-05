const passport = require('passport');
const T = require('../core/Tools');
const EM = require('../core/EntityMan')

const props = ['title', 'leads', 'name', '_id'];
const pipelineMod = 'pipeline';
const pipeMod = 'pipe';
const leadMod = 'lead';
const contactMod = 'contact';
const productMod = 'product';

// Pipeline and Pipes
const createPipeline = async (req, res, next) => {
  const data = req.body;
  let pipeline = null;
  try {
    pipeline = await EM.createEntity(pipelineMod, data);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true, pipeline });
};

const getPipelines = async (req, res, next) => {
  let pipelines = [];
  try {
    pipelines = await EM.getEntities(pipelineMod); 
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  pipelines = T.removeProps(pipelines);

  return res.status(200).json({ success: true, pipelines });
};

const getPipelineData = async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  let pipes = null;
  try {
    const pipelineData = await EM.getEntityById(pipelineMod, id)
    .populate({
      path: 'pipes',
      populate: {
          path: 'leads',
          model: 'Lead'
      }});

    pipes = pipelineData.pipes;
    pipes = T.removeProps(pipes, props);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true, pipes });
};

const deletePipeline = async (req, res) => {
  const pipeline = req.params.id;
  try {
    //
    const pipes = await EM.getEntitiesByData(pipeMod, { pipeline });

    const length = pipes.length;
    for (let i = 0; i < length; i++) {
      const pipe = pipes[i];
      pipe.leads.map(async id => await EM.deleteEntity(leadMod, id));
      await EM.deleteEntity(pipeMod, pipe._id);
    }

    await EM.deleteEntity(pipelineMod, pipeline);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true });
};

const createPipe = async (req, res, next) => {
  const { title, pipelineId } = req.body;
  let pipe = null;
  try {
    const pipeline = await EM.getEntityById(pipelineMod, pipelineId);
    pipe = await EM.createEntity(pipeMod , { title, pipeline: pipelineId });

    pipeline.pipes.push(pipe._id);
    await pipeline.save()
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true, pipe });
};

const movePipe = async (req, res, next) => {
  const {
    sourceIndex,
    destinationIndex,
    pipelineId
  } = req.body;

  let pipeline = null;
  let pipes = null;
  try {
    pipeline = await EM.getEntityById(pipelineMod ,pipelineId)
    .populate({
      path: 'pipes',
      populate: {
          path: 'leads',
          model: 'Lead'
      }
  });

    if (sourceIndex === 0 && destinationIndex === 0) {
      return res.status(200).json({ success: true, pipes: pipeline.pipes });
    }

    const pipe = pipeline.pipes.splice(sourceIndex, 1)[0];
    pipeline.pipes.splice(destinationIndex, 0, pipe);

    await pipeline.save();
    pipes = T.removeProps(pipeline.pipes, props);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true, pipes });
};

const deletePipe = async (req, res) => {
  const { id } = req.params;
  try {
    const pipe = await EM.getEntityById(pipeMod, id);
    pipe.leads.map(async id => await EM.deleteEntity(leadMod, id));

    const pipeline = await EM.getEntityById(pipelineMod, pipe.pipeline);
    pipeline.pipes = pipeline.pipes.filter(x => x.toString() !== id.toString());

    await pipeline.save();
    await EM.deleteEntity(pipeMod, id);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true });
};

const updatePipeTitle = async (req, res, next) => {
  const { id, newTitle } = req.body;
  let pipe = null;
  try {
    pipe = await EM.getEntityById(pipeMod ,id);
    if (pipe.title === newTitle) {
      return res.status(200).json({ success: true, updatedPipe: pipe });
    }

    pipe.title = newTitle;
    await pipe.save();
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true, updatedPipe: pipe });
};

// Lead
const getLead = async (req, res, next) => {
  const { id } = req.params;
  let lead = null;
  try {
    lead = await EM.getEntityById(leadMod ,id)
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true, lead });
};

const createLead = async (req, res, next) => {
  const { pipeId } = req.body;
  let lead = null;
  try {
    const pipe = await EM.getEntityById(pipeMod, pipeId);
    let system = await EM.getEntityByData(leadMod, { system: true });
        if (!system) {
          lead = await EM.createEntity(leadMod, { system: true, name: 'SETUP', pipe: pipe._id });
        } else {
            const defaultData = {
                system: false,
                fields: system.fields,
                pipe: pipe._id
            }

            lead = await EM.createEntity(leadMod, defaultData);
        }
 
    pipe.leads.push(lead._id);
    await pipe.save();
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }
 
  return res.status(200).json({ success: true, lead });
};

const deleteLead = async (req, res) => {
  const { id } = req.params;
  try {
    const lead = await EM.getEntityById(leadMod ,id);
    const pipe = await EM.getEntityById(pipeMod ,lead.pipe);

    const index = pipe.leads.indexOf(id);
    pipe.leads.splice(index, 1);
    await pipe.save();

    const contact = await EM.getEntityById(contactMod, lead.contact);
    if (contact) {
      contact.leads = contact.leads.filter(x => x !== id);
      await contact.save();
    }

    let product = await EM.getEntityById(productMod, lead.product);
    if (product) {
      product.leads = product.leads.filter(x => x !== id); 
      await vehicle.save();
    }

    await EM.deleteEntity(leadMod ,id);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true });
};

const moveLead = async (req, res, next) => {
  const {
    sourceId,
    sourceIndex,
    destinationId,
    destinationIndex
  } = req.body;

  let destinationPipe = null;
  let sourcePipe = null;
  let lead = null;
  try {
    sourcePipe = await EM.getEntityById(pipeMod, sourceId);
    lead = sourcePipe.leads.splice(sourceIndex, 1)[0];

    if (sourceId === destinationId) {
      destinationPipe = sourcePipe;
    } else {
      destinationPipe = await EM.getEntityById(pipeMod, destinationId);
    }

    destinationPipe.leads.splice(destinationIndex, 0, lead);
    await sourcePipe.save();

    if (sourceId !== destinationId) {
      await destinationPipe.save();
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true, lead });
};

module.exports = {
  createPipeline,
  getPipelines,
  getPipelineData,
  createPipe,
  createLead,
  moveLead,
  updatePipeTitle,
  getLead,
  movePipe,
  deleteLead,
  deletePipe,
  deletePipeline,
};