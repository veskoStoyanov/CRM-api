const passport = require('passport');
const T = require('../core/Tools');
const P = require('../core/PipeMan');

const getAllPipelines = async (req, res, next) => {
  const { id } = req.params;
  let pipelines = [];
  try {
    pipelines = await P.getAllPipelines(id);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true, pipelines });
};

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

const createLead = async (req, res, next) => {
  const { id } = req.params;
  let lead = null;
  try {
    lead = await P.createLead(req.body);
    const pipeline = await P.getPipelineById(id)
    const pipe = await P.getPipeById(pipeline.pipes[0]);
    pipe.leads.push(lead);
    pipe.save();
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true, lead });
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

const updatePipeTitle = async (req, res, next) => {
  const { id, newTitle } = req.body;
  try {
    const pipe = await P.getPipeById(id);
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

module.exports = {
  getAllPipelines,
  getPipelineData,
  createPipe,
  createLead,
  moveLead,
  updatePipeTitle,
  getLead,
  movePipe
};