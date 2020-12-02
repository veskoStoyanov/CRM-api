const passport = require('passport');
const T = require('../core/Tools');
const LM = require('../core/ListMan');
const CM = require('../core/ContactMan');

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
    vehicles = T.removeProps(vehicles);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true, vehicles });
};

const getOneVehicle = async (req, res, next) => {
  const { id } = req.params;
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
    const contact = await CM.getContactById(vehicle.contact);
    if (contact) {
      const index = contact.vehicles.indexOf(lead._id);
      contact.vehicles.splice(index, 1);
      await contact.save();
    }

    await LM.deleteVehicle(id)
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true });
};

// Policy
const createPolicy = async (req, res, next) => {
  let policy = null;
  try {
    policy = await LM.createPolicy({})
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true, policy });
};

const getPolicies = async (req, res, next) => {
  let policies = null;
  try {
    policies = await LM.getAllPolicies();
    policies = T.removeProps(policies);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true, policies });
};

const getOnePolicy = async (req, res, next) => {
  const { id } = req.params;
  let policy = null;
  try {
    policy = await LM.getPolicyById(id);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true, policy });
};

const updatePolicy = async (req, res, next) => {
  const { id } = req.params;
  const updatedData = req.body;
  let policy = null;
  try {
    policy = await LM.getPolicyById(id);

    Object.keys(updatedData)
      .forEach(key => {
        policy[key] = updatedData[key];
      });

    await policy.save();
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true, policy });
};

const deletePolicy = async (req, res) => {
  const { id } = req.params;
  try {
    const policy = await LM.getPolicyById(id);
    const vehicle = await LM.getVehicleById(policy.vehicle);

    if (vehicle) {
      const index = vehicle.policies.indexOf(id);
      vehicle.policies.splice(index, 1);
      await vehicle.save();
    }

    const contact = await CM.getContactById(policy.contact);
    if (contact) {
      const index = contact.policies.indexOf(id);
      contact.policies.splice(index, 1);
      await contact.save();
    }
      
    await LM.deletePolicy(id)
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
  deleteVehicle,
  createPolicy,
  getPolicies,
  getOnePolicy,
  updatePolicy,
  deletePolicy
};