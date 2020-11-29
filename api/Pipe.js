const passport = require('passport');
const T = require('../core/Tools');
const P = require('../core/PipeMan');

// const getPipes = async (req, res, next) => {
// 	passport.authenticate('jwt-strategy', { session: false }, async (err, user) => {
// 		if (err) { return next(err); }

// 		if (!user) { return res.status(400).json({ errors: [err] }); }

//     let pipes = [];
//     try {
//       pipes = await P.getAll();
//     } catch (e) {
//       console.log(e);
//     }

// 		return res.status(200).json({ success: true, pipes});
// 	})(req, res, next);
// };

const getPipes = async (req, res, next) => {
  const { pipeName } = req.params;
  const pipeline = await P.getAllByName(pipeName);

  return res.status(200).json({ success: true, pipeline });
};

const createPipe = async (req, res, next) => {
  const pipe = await P.create(req.body);

  return res.status(200).json({ success: true, pipe });
};

const createLead = async (req, res, next) => {
  const { pipeName } = req.params;

  const lead = await P.createLead(req.body);
  const pipes = await P.getAllByName(pipeName);
  const newLeads = pipes.find(x => x.title === 'New Leads')
  newLeads.leads.push(lead)
  await newLeads.save();

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

  const sourcePipe = await P.getById(sourceId);
  const lead = sourcePipe.leads.splice(sourceIndex, 1)[0];

  if (sourceId === destinationId) {
    destinationPipe = sourcePipe;
  } else {
    destinationPipe = await P.getById(destinationId);
  }

  destinationPipe.leads.splice(destinationIndex, 0, lead);
  await sourcePipe.save();

  if (sourceId !== destinationId) {
    await destinationPipe.save();
  }

  return res.status(200).json({ success: true, lead });
};

const updateTitle = async (req, res, next) => {
  const { id, newTitle} = req.body;
  const pipe = await P.getById(id);
  pipe.title = newTitle;
  await pipe.save();

  return res.status(200).json({ success: true, updatedPipe: pipe });
};


module.exports = {
  getPipes,
  createPipe,
  createLead,
  moveLead,
  updateTitle
};