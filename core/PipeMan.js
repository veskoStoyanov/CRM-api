const Pipe = require('../models/Pipe');
const Lead = require('../models/Lead');
const Pipeline = require('../models/Pipeline');

const PipeMan = {
    getAllPipelines (user) {
         return Pipeline.find({user});
    },

    getPipelineById (id) {
        return Pipeline.findById(id);
   },
  
   getPipelineDataById(id) {
        return Pipeline.findById(id)
        .populate({ 
            path: 'pipes',
            populate: {
              path: 'leads',
              model: 'Lead'
            } 
         })
    },

    getPipeById(id) {
        return Pipe.findById(id);
    },

    createPipe(data) {
        return Pipe.create(data)       
    },

    createLead(data) {
        return Lead.create(data)       
    },
    
    getLeadById(id) {
        return Lead.findById(id)
    },
}

module.exports = PipeMan;