const Vehicle = require('../models/Vehicle');

const ListMan = {
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
}

module.exports = ListMan;