const mongoose = require("mongoose")
const Joi = require("joi")

const speakingSchema = mongoose.Schema({
    video: String,
    genres: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Genre",
      },
    ],
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
  
})

const speakingAddJoi = Joi.object({
  video: Joi.string().uri().min(6).max(1000).required(),
  genres: Joi.array().items(Joi.objectid()).min(1).required(),
})
const speakingEditJoi = Joi.object({
  video: Joi.string().uri().min(6).max(1000),
  genres: Joi.array().items(Joi.objectid()).min(1),
})

const Speaking = mongoose.model("Speaking", speakingSchema)

module.exports.Speaking = Speaking
module.exports.speakingAddJoi = speakingAddJoi
module.exports.speakingEditJoi = speakingEditJoi


