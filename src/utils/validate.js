import Joi  from "joi-browser";


const schema = {
    name: Joi.string().min(3).max(40).required(),
    address: Joi.string().min(3).max(50).required(),
    room: Joi.number().max(6).required(),
    roomkv: Joi.number().min(30).required(),
    roomkvsum: Joi.number().min(4000000).required(),
    companyid: Joi.number().required()
  };

  const bankValidateSchema = {
    name: Joi.string().min(3).max(40).required(),
    address: Joi.string().min(3).max(40).required()
  }

  const editBankValidateSchema = {
    name: Joi.string().min(3).max(40),
    address: Joi.string().min(3).max(40)
  }

  const mortgageValidateSchema = {
    year: Joi.number().min(10).max(20).required(),
    sum: Joi.number().min(100000000).max(1500000000).required()
  }

  const editMortgageValidateSchema = {
    year: Joi.number().min(10).max(20).required(),
    sum: Joi.number().min(100000000).max(1500000000).required()
  }

  const editSchema = {
    name: Joi.string().min(3).max(40).allow(null).allow(''),
    address: Joi.string().min(3).max(50).allow(null).allow(''),
    room: Joi.number().max(6).allow(null).allow(''),
    roomkv: Joi.number().max(60).allow(null).allow(''),
    roomkvsum: Joi.number().max(60000000).allow(null).allow(''),
    companyid: Joi.number().allow(null).allow('')
  };

export {
    schema, editSchema, editMortgageValidateSchema, mortgageValidateSchema, editBankValidateSchema, bankValidateSchema
}