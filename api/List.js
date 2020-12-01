const passport = require('passport');
const T = require('../core/Tools');
const LM = require('../core/ListMan');
const PM = require('../core/PipeMan');

// Vehicle
const createVehicle = async (req, res, next) => {
  let vehicle = null;
  try {
    vehicle = await LM.createVehicle({})
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true, vehicle });
};

const getVehicles = async (req, res, next) => {
    let vehicles = null;
    try {
      vehicles = await LM.getAllVehicles();
    } catch (e) {
      console.log(e);
      return res.status(400).json({ success: false, errors: [''] });
    }
  
    return res.status(200).json({ success: true, vehicles });
  };

  const getOneVehicle = async (req, res, next) => {
      const {id} = req.params;
    let vehicle = null;
    try {
      vehicle = await LM.getVehicleById(id);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ success: false, errors: [''] });
    }
    
    return res.status(200).json({ success: true, vehicle });
  };

  const updateVehicle = async (req, res, next) => {
    const { id } = req.params;
    const updatedData = req.body;
    let vehicle = null;
    try {
        vehicle = await LM.getVehicleById(id);
  
      Object.keys(updatedData)
        .forEach(key => {
            vehicle[key] = updatedData[key];
        });
  
      await vehicle.save();
    } catch (e) {
      console.log(e);
      return res.status(400).json({ success: false, errors: [''] });
    }
  
    return res.status(200).json({ success: true, vehicle });
  };
  
  const deleteVehicle = async (req, res) => {
    const { id } = req.params;
    try {
      const vehicle = await LM.getVehicleById(id);

      for (let i = 0; i < vehicle.leads.length; i++) {
        const lead = await PM.getLeadById(vehicle.leads[i]);
        lead.vehicle = '';
        await lead.save();
      }

      await LM.deleteVehicle(id)
     
    } catch (e) {
      console.log(e);
      return res.status(400).json({ success: false, errors: [''] });
    }
  
    return res.status(200).json({ success: true });
  };


module.exports = {
    createVehicle,
    getVehicles,
    getOneVehicle,
    updateVehicle,
    deleteVehicle
};