const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const models = require('../models');

const transporter = nodemailer.createTransport({
  host: "neon.superhosting.bg",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMT_USER,
    pass: process.env.SMT_PASS
  }
});

const defaultFields = ['name', '_id'];

const Tools = {
  generateToken (data) {
    return jwt.sign(
      { data },
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
  },

  async sendLoginEmail(data) {
    const token = this.generateToken(data)
    console.log(token);
    
    // return transporter.sendMail({
    //   from: process.env.EMAIL_FROM,
    //   to: email,
    //   subject: 'Account activation link',

    //   html: `<hr/><h1>Please use the following link <a href=${process.env.CLIENT_URL}/login/activate/${token}>${process.env.CLIENT_URL}</a> to activate your account</h1><hr/>`
    // })
  },

  removePropsHelper (obj, fields) {
		const alteredObj = {};
		Object.keys(obj)
			.forEach(key => {
				if (fields.includes(key)) {
					if (typeof obj[key] === 'object') {
						obj[key] = this.removeProps(obj[key], fields);
					}

					alteredObj[key] = obj[key];
				}	
			});
			
		return alteredObj;
	},

	removeProps(data, fields = defaultFields) {
		if (data instanceof mongoose.Model) {
			data = data.toObject();	
		}
		
		if (Array.isArray(data)) {
			return data.map(el => this.removeProps(el, fields));
		} else if (data != null && data.constructor.name === "Object") {
			return this.removePropsHelper(data, fields);	
		}
		
		return data;
  },
  
  getModel(type) {
    return models[type[0].toUpperCase() + type.slice(1)];
  }
}

module.exports = Tools;