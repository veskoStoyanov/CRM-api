const Pipe = require('../models/Pipe');
const Lead = require('../models/Lead');
const Pipeline = require('../models/Pipeline');

const PipeMan = {
    getAllPipelines() {
        return Pipeline.find();
    },
    
    getPipelineById(id) {
        return Pipeline.findById(id);
    },

    createPipeline(data) {
        return Pipeline.create(data)
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

    deletePipeline(_id) {
        return Pipeline.deleteOne({ _id });
    },

    getPipeById(id) {
        return Pipe.findById(id);
    },

    getPipeByLead(id) {
       return Pipe.findById(id);
    },

    getPipesByPipeline(pipeline) {
        return Pipe.find({pipeline});
     },

    createPipe(data) {
        return Pipe.create(data);
    },

    deletePipe(_id) {
        return Pipe.deleteOne({ _id });
    },

    createLead(data) {
        return Lead.create(data);
    },

    deleteLead(_id) {
        return Lead.deleteOne({ _id });
    },

    getLeadById(id) {
        return Lead.findById(id);
    },

    deleteManyLeads (leads) {
        return leads.map(async id => await this.deleteLead(id))
    }
}

module.exports = PipeMan;