const Vehicle = require('../models/Vehicle');
const Policy = require('../models/Policy');

const ListMan = {
    // Vehicle
    createVehicle(data) {
        return Vehicle.create(data);
    },

    getAllVehicles() {
        return Vehicle.find();
    },

    getVehicleById(id) {
        return Vehicle.findById(id)
    },

    deleteVehicle(_id) {
        return Vehicle.deleteOne({ _id });
    },

    //Policy
    createPolicy(data) {
        return Policy.create(data);
    },

    getAllPolicies() {
        return Policy.find();
    },

    getPolicyById(id) {
        return Policy.findById(id)
    },

    deletePolicy(_id) {
        return Policy.deleteOne({ _id });
    },
}

module.exports = ListMan;