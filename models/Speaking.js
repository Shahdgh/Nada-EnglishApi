const mongoose = require("mongoose")
const Joi = require("joi")

const speakingSchema = mongoose.Schema({
    video: String,
  
})

const speakingAddJoi = Joi.object({
  video: Joi.string().uri().min(6).max(1000).required(),
})


const Speaking = mongoose.model("Speaking", speakingSchema)

module.exports.Speaking = Speaking
module.exports.speakingAddJoi = speakingAddJoi

