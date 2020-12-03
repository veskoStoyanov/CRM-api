const passport = require('passport');
const T = require('../core/Tools');
const P = require('../core/PipeMan');
const EM = require('../core/EntityMan')

const props = ['title', 'leads', 'name', '_id'];

// Pipeline and Pipe
const createPipeline = async (req, res, next) => {
  const data = req.body;
  let pipeline = null;
  try {
    pipeline = await P.createPipeline(data);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true, pipeline });
};

// Get all pipelines for User
const getAllPipelines = async (req, res, next) => {
  let pipelines = [];
  try {
    pipelines = await P.getAllPipelines();
    pipelines = T.removeProps(pipelines);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true, pipelines });
};

// Get all pipes and leads for a Pipeline
const getPipelineData = async (req, res, next) => {
  const { id } = req.params;
  let pipes = null;
  try {
    const pipelineData = await P.getPipelineDataById(id);
    pipes = pipelineData.pipes;
    pipes = T.removeProps(pipes, props);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true, pipes });
};

const deletePipeline = async (req, res) => {
  const { id } = req.params;
  try {
    const pipes = await P.getPipesByPipeline(id);

    const length = pipes.length;
    for (let i = 0; i < length; i++) {
      await P.deleteManyLeads(pipes[i].leads);
      await P.deletePipe(pipes[i]._id);
    }

    await P.deletePipeline(id);
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
    const pipeline = await P.getPipelineById(pipelineId);
    pipe = await P.createPipe({ title, pipeline: pipelineId });

    pipeline.pipes.push(pipe);
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
    pipeline = await P.getPipelineDataById(pipelineId);
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
    const pipe = await P.getPipeById(id);
    await P.deleteManyLeads(pipe.leads);

    const pipeline = await P.getPipelineById(pipe.pipeline);
    const index = pipeline.pipes.indexOf(id);
    pipeline.pipes.splice(index, 1);

    await pipeline.save()
    await P.deletePipe(id);
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
    pipe = await P.getPipeById(id);

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
    lead = await P.getLeadById(id)
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true, lead });
};

const createLead = async (req, res, next) => {
  const { pipelineId } = req.body;
  let lead = null;
  try {
    lead = await P.createLead({});
    const pipeline = await P.getPipelineById(pipelineId);

    const pipe = await P.getPipeById(pipeline.pipes[0]);
    if (!pipe) {
      return res.status(400).json({ success: false, errors: [''] });
    }
  
    pipe.leads.push(lead);
    pipe.save();

    lead.pipe = pipe._id;
    await lead.save();
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true, lead });
};

const updateLead = async (req, res, next) => {
  const { id } = req.params;
  const updatedData = req.body;
  let lead = null;
  try {
    lead = await P.getLeadById(id);

    Object.keys(updatedData)
      .forEach(key => {
        lead[key] = updatedData[key];
      });

    await lead.save();
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true, lead });
};

const deleteLead = async (req, res) => {
  const { id } = req.params;
  try {
    const lead = await P.getLeadById(id);
    const pipe = await P.getPipeByLead(lead.pipe);

    const index = pipe.leads.indexOf(id);
    pipe.leads.splice(index, 1);
    await pipe.save();

    const contact = await EM.getEntityById(lead.contact, 'contact');
    if (contact) {
      const contactIndex = contact.leads.indexOf(id);
      contact.leads.splice(contactIndex, 1);
      await contact.save();
    }

    const vehicle = await EM.getEntityById(lead.vehicle, 'product');
    if (vehicle) {
      const vehicleIndex = vehicle.leads.indexOf(id);
      vehicle.leads.splice(contactIndex, 1);
      await vehicle.save();
    }

    await P.deleteLead(id);
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
    sourcePipe = await P.getPipeById(sourceId);
    lead = sourcePipe.leads.splice(sourceIndex, 1)[0];

    if (sourceId === destinationId) {
      destinationPipe = sourcePipe;
    } else {
      destinationPipe = await P.getPipeById(destinationId);
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
  getAllPipelines,
  getPipelineData,
  createPipe,
  createLead,
  moveLead,
  updatePipeTitle,
  getLead,
  movePipe,
  updateLead,
  deleteLead,
  deletePipe,
  deletePipeline
};