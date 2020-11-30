const passport = require('passport');
const T = require('../core/Tools');
const P = require('../core/PipeMan');
const Auth = require('../core/Auth');

// Pipeline and Pipe

// Get all pipelines for User
const getAllPipelines = async (req, res, next) => {
  const { id } = req.params;
  let pipelines = [];
  try {
    const user = await Auth
    .getById(id)
    .populate('pipelines');

    pipelines = user.pipelines;
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }
  console.log(pipelines);
  return res.status(200).json({ success: true, pipelines });
};


// Get all pipes and leads for a Pipeline
const getPipelineData = async (req, res, next) => {
  const { id } = req.params;
  let pipes = null;
  try {
    const pipelineData = await P.getPipelineDataById(id);
    pipes = pipelineData.pipes;
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true, pipes });
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

    if (sourceIndex === 0 || destinationIndex === 0) {
      return res.status(200).json({ success: true, pipes: pipeline.pipes });
    }

    const pipe = pipeline.pipes.splice(sourceIndex, 1)[0];
    pipeline.pipes.splice(destinationIndex, 0, pipe);
    await pipeline.save();
    pipes = pipeline.pipes
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true, pipes });
};

const updatePipeTitle = async (req, res, next) => {
  const { id, newTitle } = req.body;
  let pipe = null;
  try {
    pipe = await P.getPipeById(id);
    if (pipe.title === newTitle || pipe.title === 'New Leads') {
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
  const user = '5fc404268c42ba2b7cdfbb6d';
  const { pipelineId } = req.body;
  let lead = null;
  try {
    lead = await P.createLead({ user });
    const pipeline = await P.getPipelineById(pipelineId);
    const pipe = await P.getPipeById(pipeline.pipes[0]);
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
    await P.deleteLead(id);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true});
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
  getAllPipelines,
  getPipelineData,
  createPipe,
  createLead,
  moveLead,
  updatePipeTitle,
  getLead,
  movePipe,
  updateLead,
  deleteLead
};