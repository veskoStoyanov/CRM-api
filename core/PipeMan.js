const Pipe = require('../models/Pipe');
const Lead = require('../models/Lead');

const PipeMan = {
    getAllByName(name) {
        return Pipe
            .find({name})
            .populate('leads')    
    },

    getById(id) {
        return Pipe.findById(id)
    },

    create(data) {
        return Pipe.create(data)       
    },

    createLead(data) {
        return Lead.create(data)       
    }
}

module.exports = PipeMan;