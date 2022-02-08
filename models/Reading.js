const mongoose = require("mongoose")
const Joi = require("joi")

const readingSchema = mongoose.Schema({
    video: String,
  
})

const readingAddJoi = Joi.object({
  video: Joi.string().uri().min(6).max(1000).required(),
})


const Reading = mongoose.model("Reading", readingSchema)

module.exports.Reading = Reading
module.exports.readingAddJoi = readingAddJoi

