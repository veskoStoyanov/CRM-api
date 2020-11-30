const Pipe = require('../models/Pipe');
const Lead = require('../models/Lead');
const Pipeline = require('../models/Pipeline');

const PipeMan = {
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

    getPipeById(id) {
        return Pipe.findById(id);
    },

    getPipeByLead(id) {
       return  Pipe.findById(id)
    },

    createPipe(data) {
        return Pipe.create(data)
    },

    createLead(data) {
        return Lead.create(data)
    },

    deleteLead(_id) {
        return Lead.deleteOne({ _id })
    },

    getLeadById(id) {
        return Lead.findById(id)
    },
}

module.exports = PipeMan;